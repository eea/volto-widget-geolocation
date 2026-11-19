import {
  getCountryCode,
  makeSearchUrl,
  getBioTags,
  getCountries,
  sortByLabel,
} from './util';
import countries from 'i18n-iso-countries/index';

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
    const password = 'admin'; //betterleaks:allow
    const countryCode = 'RO';
    const expectedUrl = `https://secure.geonames.org/searchJSON?q=${text}&country=${countryCode}&featureClass=A&continentCode=&maxRows=10&username=${password}`;
    expect(makeSearchUrl(data, text, password, countryCode)).toEqual(
      expectedUrl,
    );
  });

  it('creates correct URL with no countryCode', () => {
    const data = { featureClass: 'country', continents: 'EU' };
    const text = 'Romania';
    const password = 'admin'; //betterleaks:allow
    const countryCode = undefined;
    const expectedUrl = `https://secure.geonames.org/searchJSON?q=${text}&country=&featureClass=A&continentCode=EU&maxRows=10&username=${password}`;
    expect(makeSearchUrl(data, text, password, countryCode)).toEqual(
      expectedUrl,
    );
  });

  it('creates correct URL with no countryCode and continentCode', () => {
    const data = { featureClass: 'test' };
    const text = 'Romania';
    const password = 'admin'; //betterleaks:allow
    const countryCode = undefined;
    const expectedUrl = `https://secure.geonames.org/searchJSON?q=${text}&country=&continentCode=&maxRows=10&username=${password}`;
    expect(makeSearchUrl(data, text, password, countryCode)).toEqual(
      expectedUrl,
    );
  });

  it('creates correct URL with no featureClass', () => {
    const data = {};
    const text = 'Romania';
    const password = 'admin'; //betterleaks:allow
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
      region2: { title: 'Region 2' },
      region1: { title: 'Region 1' },
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
      { label: 'Country 2', value: 'name_country2' },
      { label: 'Mapped Country 1', value: 'name_country1' },
    ];
    expect(getCountries(geoTags, countryMappings)).toEqual(expectedCountries);
  });

  it('returns no countries', () => {
    expect(getCountries()).toEqual([]);
  });
});

describe('sortByLabel', () => {
  it('sorts items by label alphabetically', () => {
    const items = [
      { label: 'Romania', value: 'geo-798549' },
      { label: 'Austria', value: 'geo-2782113' },
      { label: 'Belgium', value: 'geo-2802361' },
    ];
    const expected = [
      { label: 'Austria', value: 'geo-2782113' },
      { label: 'Belgium', value: 'geo-2802361' },
      { label: 'Romania', value: 'geo-798549' },
    ];
    expect(sortByLabel(items)).toEqual(expected);
  });

  it('does not mutate the original array', () => {
    const items = [
      { label: 'Romania', value: 'geo-798549' },
      { label: 'Austria', value: 'geo-2782113' },
    ];
    const sorted = sortByLabel(items);
    expect(items[0].label).toEqual('Romania');
    expect(sorted[0].label).toEqual('Austria');
  });

  it('handles items with undefined or null labels without crashing', () => {
    const items = [
      { label: undefined, value: 'geo-unknown' },
      { label: null, value: 'geo-missing' },
      { label: 'Austria', value: 'geo-2782113' },
    ];
    const sorted = sortByLabel(items);
    expect(sorted[2].label).toEqual('Austria');
  });
});
