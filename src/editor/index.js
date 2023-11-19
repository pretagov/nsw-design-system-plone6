import { installIntroText } from './IntroText';
import { installSmallText } from './SmallText';

// This defines the order they're registered
const allPluginInstallers = [installSmallText, installIntroText];

export function installEditorPlugins(config) {
  return allPluginInstallers.reduce((config, installer) => {
    return installer(config);
  }, config);
}
