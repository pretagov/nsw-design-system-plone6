import customReducers from '../reducers';
import { GET_NSWSITESETTINGS } from '../constants/ActionTypes';
import {
  nswSiteSettingsFromComponent,
  subfooterFromComponent,
  withContentExpander,
} from '../helpers/contentExpanders';

// The action types of volto-siteinfo and volto-subfooter
const GET_SITEINFO = 'GET_SITEINFO';
const GET_SUBFOOTER = 'GET_SUBFOOTER';

export const applyReducersConfig = (config) => {
  config.addonReducers = { ...customReducers, ...config.addonReducers };

  // Fill the site-wide settings from the content request's expanded components
  const { siteInfo, subFooter, nswSiteSettings } = config.addonReducers;
  config.addonReducers.siteInfo = withContentExpander(
    siteInfo,
    'siteinfo',
    GET_SITEINFO,
  );
  config.addonReducers.subFooter = withContentExpander(
    subFooter,
    'subfooter',
    GET_SUBFOOTER,
    subfooterFromComponent,
  );
  config.addonReducers.nswSiteSettings = withContentExpander(
    nswSiteSettings,
    'nswSiteSettings',
    GET_NSWSITESETTINGS,
    nswSiteSettingsFromComponent,
  );
};

export default applyReducersConfig;
