import countries from 'i18n-iso-countries';
import { assign, values, keys } from 'lodash';
export function getCountryCode(countryName = '') {
  return countries.getAlpha2Code(countryName, 'en');
}

export function makeSearchUrl(data, text, password, countryCode) {
  const { featureClass, continents = '' } = data;
  const filterFeature = {
    country: 'A',
    stream: 'H',
    parks: 'L',
    city: 'P',
    road: 'R',
    spot: 'S',
    mountain: 'T',
    undersea: 'U',
    forest: 'V',
  };
  if (featureClass) {
    let url = Object.keys(filterFeature).map((item) => {
      if (featureClass.startsWith(item)) {
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=${
          filterFeature[item]
        }&continentCode=${continents}&maxRows=10&username=${password}`;
      }
      return undefined;
    });
    if (url.every((item) => item === undefined))
      return `https://secure.geonames.org/searchJSON?q=${text}&country=${
        countryCode || ''
      }&continentCode=${continents}&maxRows=10&username=${password}`;
    return url.find((item) => item !== undefined);
  }
  return `https://secure.geonames.org/searchJSON?q=${text}&country=${
    countryCode || ''
  }&continentCode=${continents}&maxRows=10&username=${password}`;
}

export function getBioTags(biotags = {}) {
  const bioRegions = Object.keys(biotags).map((item) => ({
    label: biotags[item].title,
    value: item,
  }));
  return bioRegions;
}

export function getCountries(geoTags = {}) {
  let countries = assign({}, ...values(geoTags));
  return keys(countries)
    .filter((item) => item !== 'title')
    .map((item) => ({
      label: countries[item],
      value: item,
    }));
}
