import customReducers from '../reducers';

export const applyReducersConfig = (config) => {
  config.addonReducers = { ...customReducers };
};

export default applyReducersConfig;
