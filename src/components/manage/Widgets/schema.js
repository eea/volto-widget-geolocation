import { eeaCountries } from './eeaCountries';

export const GeoSearchSchema = {
  title: 'GeoGraphical Search',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['search', 'countries', 'featureClass', 'continents'],
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
      choices: [
        ['all', 'all'],
        ['country,state,region...', 'country,state,region...'],
        ['stream,lake...', 'stream,lake...'],
        ['parks,area...', 'parks,area...'],
        ['city,village...', 'city,village...'],
        ['road,railroad', 'road,railroad'],
        ['spot,building,farm', 'spot,building,farm'],
        ['mountain,hill,rock...', 'mountain,hill,rock...'],
        ['undersea', 'undersea'],
        ['forest,health...', 'forest,health...'],
      ],
    },
    continents: {
      description: 'Select continents',
      title: 'Continents',
      choices: [
        ['all', 'all'],
        ['Europe', 'Europe'],
        ['Africa', 'Africa'],
        ['Asia', 'Asia'],
        ['Oceania', 'Oceania'],
        ['North America', 'North America'],
        ['South America', 'South America'],
      ],
    },
  },
  required: [],
};
