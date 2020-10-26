import countries from 'i18n-iso-countries';

export function getCountryCode(countryName = '') {
  return countries.getAlpha2Code(countryName, 'en');
}
