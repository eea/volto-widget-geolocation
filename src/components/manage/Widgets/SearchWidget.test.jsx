import React from 'react';
import { IntlProvider } from 'react-intl';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SearchWidget from './SearchWidget';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';

const mockDispatch = jest.fn((action) =>
  action.url.includes('getJSON')
    ? Promise.resolve({ countryCode: 'RO' })
    : Promise.resolve({ geonames: [] }),
);

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) =>
    selector({
      geolocation: {
        api: {
          geonames: {
            password: 'demo',
          },
        },
      },
    }),
}));

jest.mock('@eeacms/volto-corsproxy/actions', () => ({
  getProxiedExternalContent: jest.fn((url, options) => ({ url, options })),
}));

jest.mock('@plone/volto/components/manage/Widgets/FormFieldWrapper', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock('@plone/volto/components/theme/Icon/Icon', () => ({
  __esModule: true,
  default: () => <span />,
}));

const renderSearchWidget = (props) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <SearchWidget {...props} />
    </IntlProvider>,
  );

describe('SearchWidget', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    getProxiedExternalContent.mockClear();
  });

  it('builds a search URL from a country name', async () => {
    const onChange = jest.fn();
    renderSearchWidget({
      data: { countries: 'Romania', featureClass: 'country' },
      onChange,
    });

    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value: 'Bucharest' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(
        'searchUrl',
        'https://secure.geonames.org/searchJSON?q=Bucharest&country=RO&featureClass=A&continentCode=&maxRows=10&username=demo',
      ),
    );
    expect(getProxiedExternalContent).toHaveBeenCalledWith(
      expect.stringContaining('searchJSON?q=Bucharest'),
      { headers: { Accept: 'application/json' } },
    );
  });

  it('resolves a geoname id to a country code before searching', async () => {
    const onChange = jest.fn();
    renderSearchWidget({
      data: { countries: 'geo-798549', featureClass: 'country' },
      onChange,
    });

    fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), {
      target: { value: 'Cluj' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(getProxiedExternalContent).toHaveBeenNthCalledWith(
      1,
      'https://secure.geonames.org/getJSON?geonameId=798549&username=demo',
      { headers: { Accept: 'application/json' } },
    );
    expect(onChange.mock.calls[0][1]).toContain('country=RO');
  });
});
