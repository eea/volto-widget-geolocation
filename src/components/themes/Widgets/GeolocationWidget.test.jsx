import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import GeolocationWidget from './GeolocationWidget';

jest.mock('semantic-ui-react', () => ({
  Popup: ({ trigger, content }) => (
    <span>
      {trigger}
      {content}
    </span>
  ),
}));

const renderWidget = (props) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <GeolocationWidget {...props} />
    </IntlProvider>,
  );

describe('theme GeolocationWidget', () => {
  it('renders nothing without geolocation values', () => {
    const { container } = renderWidget({ value: {} });

    expect(container.textContent).toBe('');
  });

  it('renders flat geolocation values', () => {
    renderWidget({
      flat: true,
      value: {
        geolocation: [
          { label: 'Romania', value: 'geo-ro' },
          { label: 'France', value: 'geo-fr' },
        ],
      },
    });

    expect(screen.getByText('Romania')).toBeTruthy();
    expect(screen.getByText('France')).toBeTruthy();
  });

  it('renders selected group fallback when grouped data is missing', () => {
    renderWidget({
      value: {
        geolocation: [{ label: 'Romania', value: 'geo-ro' }],
        selectedGroup: { label: 'EEA member countries', value: 'eea' },
      },
    });

    expect(screen.getByText('EEA member countries')).toBeTruthy();
  });

  it('renders grouped countries and ungrouped items inline', () => {
    renderWidget({
      value: {
        geolocation: [{ label: 'Romania', value: 'geo-ro' }],
        grouped_geolocation: {
          groups: [
            {
              label: 'EEA member countries',
              value: 'eea',
              countries: [
                { label: 'Romania', value: 'geo-ro' },
                { label: 'France', value: 'geo-fr' },
              ],
            },
          ],
          ungrouped: [{ label: 'Kosovo', value: 'geo-xk' }],
        },
      },
    });

    expect(
      screen.getByRole('button', { name: 'Countries in EEA member countries' }),
    ).toBeTruthy();
    expect(screen.getByText('Romania, France')).toBeTruthy();
    expect(screen.getByText('Kosovo')).toBeTruthy();
  });
});
