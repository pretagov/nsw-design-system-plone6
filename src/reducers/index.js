import navigation from './navigation/navigation';
import nswSiteSettings from './nswSiteSettings/nswSiteSettings';
import siteInfo from './siteInfo/siteInfo';

export const customReducers = {
  navigation,
  nswSiteSettings,
  siteInfo,
};

export default {
  ...customReducers,
};
