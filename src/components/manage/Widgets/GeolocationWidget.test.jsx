import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen } from '@testing-library/react';
import GeolocationWidget from './GeolocationWidget';
import { getGeoData } from '@eeacms/volto-widget-geolocation/actions';

const mockDispatch = jest.fn();
let mockState;
const mockSelectValues = {};

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockState),
}));

jest.mock('@eeacms/volto-widget-geolocation/actions', () => ({
  getGeoData: jest.fn(() => ({ type: 'GET_GEODATA' })),
}));

jest.mock('@eeacms/volto-widget-geolocation/components', () => ({
  GeolocationWidgetView: ({ value, className }) => (
    <div className={className}>
      {(value.geolocation || []).map((item) => item.label).join(', ')}
    </div>
  ),
}));

jest.mock('@plone/volto/components/manage/Sidebar/SidebarPopup', () => ({
  __esModule: true,
  default: ({ open, children }) => (
    <div data-testid="sidebar">{open ? children : null}</div>
  ),
}));

jest.mock('@plone/volto/components/manage/Widgets/FormFieldWrapper', () => ({
  __esModule: true,
  default: ({ children, title }) => (
    <section>
      <h1>{title}</h1>
      {children}
    </section>
  ),
}));

jest.mock('@plone/volto/components/theme/Icon/Icon', () => ({
  __esModule: true,
  default: () => <span>icon</span>,
}));

jest.mock('@plone/volto/components/manage/Widgets/SelectStyling', () => ({
  Option: () => null,
  DropdownIndicator: () => null,
  selectTheme: {},
  customSelectStyles: {},
}));

jest.mock('./SearchGeoName', () => ({
  __esModule: true,
  default: () => <div data-testid="search-geoname" />,
}));

jest.mock('react-select', () => {
  const Select = ({ id, onChange, value }) => (
    <button
      type="button"
      data-testid={id}
      onClick={() => onChange(mockSelectValues[id])}
    >
      {Array.isArray(value)
        ? value.map((item) => item.label).join(', ') || id
        : value?.label || id}
    </button>
  );
  return {
    __esModule: true,
    default: Select,
    components: {
      Group: ({ children }) => <div>{children}</div>,
    },
  };
});

const renderWidget = (props) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <GeolocationWidget id="geo" onChange={jest.fn()} {...props} />
    </IntlProvider>,
  );

describe('manage GeolocationWidget', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    getGeoData.mockClear();
    Object.keys(mockSelectValues).forEach(
      (key) => delete mockSelectValues[key],
    );
    mockState = {
      geolocation: {
        data: {},
      },
    };
  });

  it('loads geodata and renders read-only values with the view widget', () => {
    renderWidget({
      value: {
        readOnly: true,
        geolocation: [{ label: 'Romania', value: 'geo-ro' }],
      },
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_GEODATA' });
    expect(getGeoData).toHaveBeenCalled();
    expect(screen.getByText('Romania')).toBeTruthy();
  });

  it('adds the static countries from a selected country group', () => {
    const onChange = jest.fn();
    mockSelectValues['geo-select-listingblock-template-group'] = {
      label: 'EEA32',
      value: 'EEA32',
    };

    renderWidget({ value: { geolocation: [] }, onChange });
    fireEvent.click(
      screen.getByTestId('geo-select-listingblock-template-group'),
    );

    expect(onChange).toHaveBeenCalledWith(
      'geo',
      expect.objectContaining({
        selectedGroup: { label: 'EEA32', value: 'EEA32' },
        geolocation: expect.arrayContaining([
          expect.objectContaining({ label: 'Austria' }),
        ]),
      }),
    );
  });

  it('adds mapped countries from backend geotags', () => {
    const onChange = jest.fn();
    mockState = {
      geolocation: {
        data: {
          geotags: {
            GroupA: {
              title: 'Group A',
              name_ro: 'Romania',
              name_fr: 'France',
            },
          },
          country_mappings: {
            Romania: 'Mapped Romania',
          },
        },
      },
    };
    mockSelectValues['geo-select-listingblock-template-group'] = {
      label: 'Group A',
      value: 'GroupA',
    };

    renderWidget({
      value: {
        geolocation: [{ label: 'Existing', value: 'existing' }],
      },
      onChange,
    });
    fireEvent.click(
      screen.getByTestId('geo-select-listingblock-template-group'),
    );

    expect(onChange).toHaveBeenCalledWith(
      'geo',
      expect.objectContaining({
        geolocation: expect.arrayContaining([
          { label: 'Existing', value: 'existing' },
          { label: 'Mapped Romania', value: 'name_ro' },
          { label: 'France', value: 'name_fr' },
        ]),
      }),
    );
  });

  it('clears group selections and forwards coverage changes', () => {
    const onChange = jest.fn();
    mockSelectValues['geo-select-listingblock-template-group'] = null;
    mockSelectValues['geo-select-listingblock-template-coverage'] = [
      { label: 'France', value: 'geo-fr' },
    ];

    renderWidget({
      value: {
        selectedGroup: { label: 'EEA32', value: 'EEA32' },
        geolocation: [{ label: 'Romania', value: 'geo-ro' }],
      },
      onChange,
    });

    fireEvent.click(
      screen.getByTestId('geo-select-listingblock-template-group'),
    );
    fireEvent.click(
      screen.getByTestId('geo-select-listingblock-template-coverage'),
    );

    expect(onChange).toHaveBeenCalledWith('geo', {
      selectedGroup: null,
      geolocation: [],
    });
    expect(onChange).toHaveBeenCalledWith('geo', {
      selectedGroup: { label: 'EEA32', value: 'EEA32' },
      geolocation: [{ label: 'France', value: 'geo-fr' }],
    });
  });
});
