import countries from 'i18n-iso-countries/index';
import en from 'i18n-iso-countries/langs/en.json';
import assign from 'lodash/assign';
import values from 'lodash/values';
import keys from 'lodash/keys';

countries.registerLocale(en);

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

export function getCountries(geoTags = {}, country_mappings = {}) {
  let countries = assign({}, ...values(geoTags));
  return keys(countries)
    .filter((item) => item !== 'title')
    .map((item) => {
      if (keys(country_mappings).includes(countries[item])) {
        return {
          label: country_mappings[countries[item]],
          value: item,
        };
      } else {
        return {
          label: countries[item],
          value: item,
        };
      }
    });
}

const addGroupMember = (groupMembers, groupName, country) => {
  if (!groupName || !country?.value) return;

  const existingMembers = groupMembers.get(groupName) || {
    label: groupName,
    countries: [],
    countryValues: new Set(),
  };

  if (!existingMembers.countryValues.has(country.value)) {
    existingMembers.countries.push(country);
    existingMembers.countryValues.add(country.value);
  }

  groupMembers.set(groupName, existingMembers);
};

export function getGeoGroupsCoverage(
  selectedCountries = [],
  eeaCountries = [],
  geotags = {},
  country_mappings = {},
) {
  const selectedItems = Array.isArray(selectedCountries)
    ? selectedCountries.filter((item) => item?.value)
    : [];
  const selectedValues = new Set(selectedItems.map((item) => item.value));
  const selectedLabels = new Map(
    selectedItems.map((item) => [item.value, item.label]),
  );
  const groupMembers = new Map();
  const hasGeotags = keys(geotags).length > 0;

  if (hasGeotags) {
    keys(geotags).forEach((groupName) => {
      const groupData = geotags[groupName] || {};
      const groupLabel = groupData.title || groupName;

      keys(groupData)
        .filter((item) => item !== 'title')
        .forEach((countryValue) => {
          const countryName = groupData[countryValue];
          const countryLabel =
            selectedLabels.get(countryValue) ||
            country_mappings[countryName] ||
            countryName;

          addGroupMember(groupMembers, groupName, {
            value: countryValue,
            label: countryLabel,
          });
          groupMembers.get(groupName).label = groupLabel;
        });
    });
  } else {
    eeaCountries.forEach((country) => {
      country.group?.forEach((groupName) => {
        addGroupMember(groupMembers, groupName, {
          value: country.value,
          label: selectedLabels.get(country.value) || country.label,
        });
      });
    });
  }

  const groups = Array.from(groupMembers.entries())
    .filter(
      ([, group]) =>
        group.countries.length > 0 &&
        group.countries.every((country) => selectedValues.has(country.value)),
    )
    .map(([value, group]) => ({
      value,
      label: group.label,
      countries: group.countries,
    }))
    .sort(
      (first, second) =>
        second.countries.length - first.countries.length ||
        first.label.localeCompare(second.label),
    );

  const coveredByGroups = new Set(
    groups.flatMap((group) => group.countries.map((country) => country.value)),
  );
  const ungrouped = selectedItems.filter(
    (item) => !coveredByGroups.has(item.value),
  );

  return {
    groups,
    ungrouped,
  };
}
