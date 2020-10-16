import {
  GeolocationWidget,
  biogeographicalData,
  eeaCountries,
  SearchWidget,
} from './components';

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
