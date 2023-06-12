import {
  getCountryCode,
  makeSearchUrl,
  getBioTags,
  getCountries,
} from './util';
import countries from 'i18n-iso-countries';

describe('getCountryCode', () => {
  it('returns correct country code with countryName', () => {
    const countryName = 'Romania';
    const countryCode = getCountryCode(countryName);
    expect(countryCode).toEqual(countries.getAlpha2Code(countryName, 'en'));
  });

  it('returns default country code without countryName', () => {
    const countryCode = getCountryCode();
    expect(countryCode).toEqual(undefined);
  });
});

describe('makeSearchUrl', () => {
  it('creates correct URL', () => {
    const data = { featureClass: 'country' };
    const text = 'Romania';
    const password = 'admin';
    const countryCode = 'RO';
    const expectedUrl = `https://secure.geonames.org/searchJSON?q=${text}&country=${countryCode}&featureClass=A&continentCode=&maxRows=10&username=${password}`;
    expect(makeSearchUrl(data, text, password, countryCode)).toEqual(
      expectedUrl,
    );
  });

  it('creates correct URL with no countryCode', () => {
    const data = { featureClass: 'country', continents: 'EU' };
    const text = 'Romania';
    const password = 'admin';
    const countryCode = undefined;
    const expectedUrl = `https://secure.geonames.org/searchJSON?q=${text}&country=&featureClass=A&continentCode=EU&maxRows=10&username=${password}`;
    expect(makeSearchUrl(data, text, password, countryCode)).toEqual(
      expectedUrl,
    );
  });

  it('creates correct URL with no countryCode and continentCode', () => {
    const data = { featureClass: 'test' };
    const text = 'Romania';
    const password = 'admin';
    const countryCode = undefined;
    const expectedUrl = `https://secure.geonames.org/searchJSON?q=${text}&country=&continentCode=&maxRows=10&username=${password}`;
    expect(makeSearchUrl(data, text, password, countryCode)).toEqual(
      expectedUrl,
    );
  });

  it('creates correct URL with no featureClass', () => {
    const data = {};
    const text = 'Romania';
    const password = 'admin';
    const countryCode = undefined;
    const expectedUrl = `https://secure.geonames.org/searchJSON?q=${text}&country=&continentCode=&maxRows=10&username=${password}`;
    expect(makeSearchUrl(data, text, password, countryCode)).toEqual(
      expectedUrl,
    );
  });
});

describe('getBioTags', () => {
  it('returns correct bio tags', () => {
    const bioTags = {
      region1: { title: 'Region 1' },
      region2: { title: 'Region 2' },
    };
    const expectedBioRegions = [
      { label: 'Region 1', value: 'region1' },
      { label: 'Region 2', value: 'region2' },
    ];
    expect(getBioTags(bioTags)).toEqual(expectedBioRegions);
  });

  it('returns no bioTags', () => {
    expect(getBioTags()).toEqual([]);
  });
});

describe('getCountries', () => {
  it('returns correct countries', () => {
    const geoTags = {
      country1: { title: 'Country 1', name_country1: 'Country 1' },
      country2: { title: 'Country 2', name_country2: 'Country 2' },
    };
    const countryMappings = { 'Country 1': 'Mapped Country 1' };
    const expectedCountries = [
      { label: 'Mapped Country 1', value: 'name_country1' },
      { label: 'Country 2', value: 'name_country2' },
    ];
    expect(getCountries(geoTags, countryMappings)).toEqual(expectedCountries);
  });

  it('returns no countries', () => {
    expect(getCountries()).toEqual([]);
  });
});
