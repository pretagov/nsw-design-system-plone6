import updateAsyncConnectConfig from './asyncConnect';
import updateBlocksConfig from './blocks';
import updateLoadablesConfig from './loadables';
import updateMiddlewareConfig from './middleware';
import updateReducersConfig from './reducers';
import updateRoutesConfig from './routes';
import updateSettingsConfig from './settings';
import updateTextEditorConfig from './textEditor';
import updateWidgetsConfig from './widgets';

export const applyAddonConfig = (config) => {
  updateAsyncConnectConfig(config);
  updateBlocksConfig(config);
  updateLoadablesConfig(config);
  updateMiddlewareConfig(config);
  updateReducersConfig(config);
  updateRoutesConfig(config);
  updateSettingsConfig(config);
  updateTextEditorConfig(config);
  updateWidgetsConfig(config);
};

export default applyAddonConfig;
