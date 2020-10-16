import Geonames from 'geonames.js';
import {
  GeolocationWidget,
  biogeographicalData,
  eeaCountries,
  SearchWidget,
} from './components';

export const geonames = new Geonames({
  username: 'nileshgulia',
  lan: 'en',
  encoding: 'JSON',
});

const applyConfig = (config) => {
  config.widgets.widget = {
    ...config.widgets.widget,
    geolocation: {
      widget: GeolocationWidget,
      vocabulary: { biogeographical: biogeographicalData, eea: eeaCountries },
    },
    search: SearchWidget,
  };
  return config;
};

export default applyConfig;
