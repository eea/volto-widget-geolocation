import {
  GeolocationWidgetEdit,
  GeolocationWidgetView,
  SearchWidget,
} from './components';
import { geolocation } from './reducers';

const applyConfig = (config) => {
  config.widgets.widget = {
    ...config.widgets.widget,
    geolocation: GeolocationWidgetEdit,
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

  // volto-widgets-view
  if (config.widgets.views?.widget) {
    config.widgets.views.widget.geolocation = GeolocationWidgetView;
  }

  return config;
};

export default applyConfig;
