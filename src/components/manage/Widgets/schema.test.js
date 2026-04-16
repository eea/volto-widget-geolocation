import { GeoSearchSchema } from './schema';
import { eeaCountries } from './eeaCountries';
import { biogeographicalData } from './biogeographical';

describe('GeoSearchSchema', () => {
  it('returns a schema with correct title', () => {
    const schema = GeoSearchSchema({});
    expect(schema.title).toBe('GeoGraphical Search');
  });

  it('has the default fieldset with expected fields', () => {
    const schema = GeoSearchSchema({});
    const defaultFieldset = schema.fieldsets.find((fs) => fs.id === 'default');
    expect(defaultFieldset).toBeDefined();
    expect(defaultFieldset.fields).toEqual([
      'search',
      'countries',
      'featureClass',
      'continents',
    ]);
  });

  it('has search property with searchGeotags widget', () => {
    const schema = GeoSearchSchema({});
    expect(schema.properties.search.widget).toBe('searchGeotags');
    expect(schema.properties.search.title).toBe('Search');
  });

  it('has countries property with choices from eeaCountries', () => {
    const schema = GeoSearchSchema({});
    expect(schema.properties.countries.title).toBe('Countries');
    expect(schema.properties.countries.choices.length).toBe(
      eeaCountries.length,
    );
  });

  it('has featureClass property with choices', () => {
    const schema = GeoSearchSchema({});
    expect(schema.properties.featureClass.title).toBe('Feature class');
    expect(schema.properties.featureClass.choices.length).toBe(10);
    // First choice should be 'all'
    expect(schema.properties.featureClass.choices[0]).toEqual([
      'all',
      'all',
    ]);
  });

  it('has continents property with choices', () => {
    const schema = GeoSearchSchema({});
    expect(schema.properties.continents.title).toBe('Continents');
    expect(schema.properties.continents.choices[0]).toEqual(['all', 'all']);
    expect(schema.properties.continents.choices[1]).toEqual(['EU', 'Europe']);
  });

  it('required array is empty', () => {
    const schema = GeoSearchSchema({});
    expect(schema.required).toEqual([]);
  });
});