import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ListResults from './ListResults';

jest.mock('@plone/volto/components/theme/Icon/Icon', () => ({
  __esModule: true,
  default: () => <span data-testid="icon">icon</span>,
}));

const romania = {
  toponymName: 'Romania',
  geonameId: 798549,
  fclName: 'country',
  countryName: 'Romania',
};

const france = {
  toponymName: 'France',
  geonameId: 3017382,
  fclName: 'country',
  countryName: 'France',
};

describe('ListResults', () => {
  it('renders mapped result labels and adds a new result', () => {
    const setValue = jest.fn();
    const { container } = render(
      <ListResults
        results={[romania, france]}
        loading={false}
        setValue={setValue}
        value={[]}
        country_mappings={{ Romania: 'Mapped Romania' }}
      />,
    );

    expect(screen.getByText('Results')).toBeTruthy();
    expect(screen.getByText('Mapped Romania')).toBeTruthy();
    expect(screen.getAllByText('France').length).toBeGreaterThan(0);
    expect(screen.getAllByText('GeonameID:').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: '798549' }).href).toBe(
      'https://www.geonames.org/798549',
    );

    fireEvent.click(container.querySelector('button'));

    expect(setValue).toHaveBeenCalledWith(romania);
  });

  it('does not add duplicate results and can show the loading state', () => {
    const setValue = jest.fn();
    const { container } = render(
      <ListResults
        results={[romania]}
        loading
        setValue={setValue}
        value={[{ label: 'Romania', value: 'geo-798549' }]}
        country_mappings={{}}
      />,
    );

    expect(screen.getByText('Loading')).toBeTruthy();

    fireEvent.click(container.querySelector('button'));

    expect(setValue).not.toHaveBeenCalled();
  });
});
