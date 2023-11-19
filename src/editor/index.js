import { installIntroText } from './IntroText';
import { installSmallText } from './SmallText';

const allPluginInstallers = [installIntroText, installSmallText];

export function installEditorPlugins(config) {
  return allPluginInstallers.reduce((config, installer) => {
    return installer(config);
  }, config);
}
