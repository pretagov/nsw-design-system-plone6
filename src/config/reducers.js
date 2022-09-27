import customReducers from '../reducers';

export const applyReducersConfig = (config) => {
  config.addonReducers = { ...customReducers, ...config.addonReducers };
};

export default applyReducersConfig;
