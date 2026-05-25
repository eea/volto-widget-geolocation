import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SearchGeoName from './SearchGeoName';
import { getGeonameSettings } from '@eeacms/volto-widget-geolocation/actions';

const mockDispatch = jest.fn();
let mockState;

jest.mock('react-redux', () => ({
  shallowEqual: jest.fn(),
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockState),
}));

jest.mock('@eeacms/volto-widget-geolocation/actions', () => ({
  getGeonameSettings: jest.fn(() => ({ type: 'GET_GEONAMES' })),
}));

jest.mock('@plone/volto/components/theme/Icon/Icon', () => ({
  __esModule: true,
  default: () => <span>icon</span>,
}));

jest.mock('./InlineForm', () => ({
  __esModule: true,
  default: ({ value, setValue, onChangeField, headerActions, footer }) => (
    <div>
      <div data-testid="value">
        {(value || []).map((item) => item.label).join(', ')}
      </div>
      <button type="button" onClick={() => onChangeField('searchUrl', '')}>
        Search
      </button>
      <button type="button" onClick={() => onChangeField('featureClass', 'P')}>
        Change schema
      </button>
      <button
        type="button"
        onClick={() => setValue([{ label: 'France', value: 'geo-fr' }])}
      >
        Replace value
      </button>
      <div>{headerActions}</div>
      <div>{footer}</div>
    </div>
  ),
}));

jest.mock('./ListResults', () => ({
  __esModule: true,
  default: ({ results, loading, setValue }) => (
    <div>
      <span>{loading ? 'Loading' : 'Loaded'}</span>
      <button type="button" onClick={() => setValue(results[0])}>
        Add {results[0].toponymName}
      </button>
    </div>
  ),
}));

describe('SearchGeoName', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    getGeonameSettings.mockClear();
    mockState = {
      content: {
        subrequests: {
          '': {
            loading: false,
            data: {
              geonames: [{ toponymName: 'Romania', geonameId: 798549 }],
            },
          },
        },
      },
      geolocation: {
        data: {
          country_mappings: {
            Romania: 'Mapped Romania',
          },
        },
      },
    };
  });

  it('loads geoname settings and saves mapped result values', () => {
    const onChange = jest.fn();
    const setPopup = jest.fn();
    render(
      <SearchGeoName
        id="geo"
        data={{ geolocation: [] }}
        block="block-id"
        setPopup={setPopup}
        onChange={onChange}
      />,
    );

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_GEONAMES' });
    expect(getGeonameSettings).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Add Romania'));
    expect(screen.getByTestId('value').textContent).toContain('Mapped Romania');

    fireEvent.click(screen.getAllByRole('button')[3]);

    expect(onChange).toHaveBeenCalledWith('geo', {
      geolocation: [{ label: 'Mapped Romania', value: 'geo-798549' }],
    });
    expect(setPopup).toHaveBeenCalledWith(false);
  });

  it('forwards schema changes and can close without saving', () => {
    const onChange = jest.fn();
    const onChangeSchema = jest.fn();
    const setPopup = jest.fn();
    render(
      <SearchGeoName
        id="geo"
        data={{ geolocation: [] }}
        block="block-id"
        setPopup={setPopup}
        onChange={onChange}
        onChangeSchema={onChangeSchema}
      />,
    );

    fireEvent.click(screen.getByText('Change schema'));
    fireEvent.click(screen.getByText('Replace value'));
    fireEvent.click(screen.getAllByRole('button')[4]);

    expect(onChangeSchema).toHaveBeenCalledWith('featureClass', 'P');
    expect(setPopup).toHaveBeenCalledWith(false);
    expect(onChange).not.toHaveBeenCalled();
  });
});
