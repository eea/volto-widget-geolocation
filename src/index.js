import { GeolocationWidget } from './components';

const applyConfig = (config) => {
  config.widgets.type = {
    ...config.widgets.type,
    select: GeolocationWidget,
  };
  return config;
};

export default applyConfig;
