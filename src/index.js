import { GeolocationWidget } from './components';

const applyConfig = (config) => {
  config.widgets.widget = {
    ...config.widgets.widget,
    geolocation: GeolocationWidget,
  };
  return config;
};

export default applyConfig;
