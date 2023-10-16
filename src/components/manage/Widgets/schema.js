import { eeaCountries } from './eeaCountries';

export const GeoSearchSchema = (props) => ({
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
      widget: 'searchGeotags',
    },
    countries: {
      description: 'Select countries',
      title: 'Countries',
      choices: eeaCountries.map((item) => [item.value, item.label]),
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
        ['EU', 'Europe'],
        ['AF', 'Africa'],
        ['AS', 'Asia'],
        ['OC', 'Oceania'],
        ['NA', 'North America'],
        ['SA', 'South America'],
      ],
    },
  },
  required: [],
});
