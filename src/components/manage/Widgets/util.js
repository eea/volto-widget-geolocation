import countries from 'i18n-iso-countries';

export function getCountryCode(countryName = '') {
  return countries.getAlpha2Code(countryName, 'en');
}

export function makeSearchUrl(data, text, password, countryCode) {
  const { featureClass, continents = '' } = data;
  if (featureClass) {
    switch (true) {
      case featureClass.startsWith('country'):
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=A&continentCode=${continents}&maxRows=10&username=${password}`;

      case featureClass.startsWith('stream'):
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=H&continentCode=${continents}&maxRows=10&username=${password}`;

      case featureClass.startsWith('parks'):
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=L&continentCode=${continents}&maxRows=10&username=${password}`;

      case featureClass.startsWith('city'):
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=P&continentCode=${continents}&maxRows=10&username=${password}`;

      case featureClass.startsWith('road'):
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=R&continentCode=${continents}&maxRows=10&username=${password}`;

      case featureClass.startsWith('spot'):
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=S&continentCode=${continents}&maxRows=10&username=${password}`;

      case featureClass.startsWith('mountain'):
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=T&continentCode=${continents}&maxRows=10&username=${password}`;

      case featureClass.startsWith('undersea'):
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=U&continentCode=${continents}&maxRows=10&username=${password}`;

      case featureClass.startsWith('forest'):
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&featureClass=V&continentCode=${continents}&maxRows=10&username=${password}`;

      default:
        return `https://secure.geonames.org/searchJSON?q=${text}&country=${
          countryCode || ''
        }&continentCode=${continents}&maxRows=10&username=${password}`;
    }
  }
  return `https://secure.geonames.org/searchJSON?q=${text}&country=${
    countryCode || ''
  }&continentCode=${continents}&maxRows=10&username=${password}`;
}
