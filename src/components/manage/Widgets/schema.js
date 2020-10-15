export const GeoSearchSchema = {
  title: 'Metadata entry',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['id', 'widget'],
    },
  ],
  properties: {
    id: {
      title: 'Metadata',
      description: 'Select metadata to be used',
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
