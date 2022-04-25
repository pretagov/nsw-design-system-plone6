import applyAddonConfig from './config';
import './theme.js';

const applyConfig = (config) => {
  applyAddonConfig(config);

  return config;
};

export default applyConfig;
