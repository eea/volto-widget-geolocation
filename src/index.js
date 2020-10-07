import { GeolocationWidget } from './components';
import { biogeographicalData, eeaCountries } from './components';

const applyConfig = (config) => {
  config.widgets.widget = {
    ...config.widgets.widget,
    geolocation: {
      widget: GeolocationWidget,
      vocabulary: { biogeographical: biogeographicalData, eea: eeaCountries },
    },
  };
  return config;
};

export default applyConfig;
