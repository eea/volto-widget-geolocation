export const GeoSearchSchema = {
  title: 'GeoGraphical Search',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['id', 'widget'],
    },
  ],
  properties: {
    id: {
      title: 'Search',
      description: 'Search for geo Tags',
      factory: 'Choice',
      type: 'string',
      choices: [
        ['title', 'Title'],
        ['description', 'Description'],
      ],
    },
    widget: {
      title: 'Display',
      type: 'string',
    },
  },
  required: ['id'],
};
