import updateApiExpandersConfig from './apiExpanders';
import updateAsyncConnectConfig from './asyncConnect';
import updateBlocksConfig from './blocks';
import updateLoadablesConfig from './loadables';
import updateMiddlewareConfig from './middleware';
import updateReducersConfig from './reducers';
import updateRoutesConfig from './routes';
import updateSettingsConfig from './settings';
import updateTextEditorConfig from './textEditor';
import updateWidgetsConfig from './widgets';

import nswLogo from 'nsw-design-system-plone6/assets/NSW-ONLY-nsw-government-logo.svg';

export const applyAddonConfig = (config) => {
  updateApiExpandersConfig(config);
  updateAsyncConnectConfig(config);
  updateBlocksConfig(config);
  updateLoadablesConfig(config);
  updateMiddlewareConfig(config);
  updateReducersConfig(config);
  updateRoutesConfig(config);
  updateSettingsConfig(config);
  updateTextEditorConfig(config);
  updateWidgetsConfig(config);

  config.settings.controlPanelsIcons['nswdesignsystem'] = nswLogo;
};

export default applyAddonConfig;
