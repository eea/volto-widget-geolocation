import { GeolocationWidget } from './components';

const applyConfig = (config) => {
  config.widgets.type = {
    ...config.widgets.type,
    boolean: GeolocationWidget,
  };
  return config;
};

export default applyConfig;
