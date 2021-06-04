import { GeolocationWidget, SearchWidget } from './components';
import { geolocation } from './reducers';

const applyConfig = (config) => {
  config.widgets.widget = {
    ...config.widgets.widget,
    geolocation: GeolocationWidget,
    searchGeotags: SearchWidget,
  };
  config.settings.allowed_cors_destinations = [
    ...(config.settings.allowed_cors_destinations || []),
    'secure.geonames.org',
  ];

  config.addonReducers = {
    ...config.addonReducers,
    geolocation,
  };
  return config;
};

export default applyConfig;
