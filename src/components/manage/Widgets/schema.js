import { eeaCountries } from './eeaCountries';

export const GeoSearchSchema = {
  title: 'GeoGraphical Search',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['search', 'countries', 'featureClass'],
    },
  ],
  properties: {
    search: {
      title: 'Search',
      description: 'Search for geo Tags',
      factory: 'Search',
      widget: 'search',
    },
    countries: {
      description: 'Select countries',
      title: 'Countries',
      choices: eeaCountries.map((item) => [item.label, item.value]),
    },
    featureClass: {
      description: 'Select feature regions for eg: lakes,parks etc',
      title: 'Feature class',
      choices: [],
    },
  },
  required: ['countries'],
};
