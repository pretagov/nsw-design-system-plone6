import { GET_NSWSITESETTINGS } from '../../constants/ActionTypes';

export function getNswSiteSettings() {
  // TODO: This probably doesn't support i18n due to the different navigation root
  return {
    type: GET_NSWSITESETTINGS,
    request: {
      op: 'get',
      path: '/@nswSiteSettings',
    },
  };
}
