import { GET_NSWSITESETTINGS } from '../../constants/ActionTypes';

export function getNswSiteSettings(url) {
  return {
    type: GET_NSWSITESETTINGS,
    request: {
      op: 'get',
      path: `${url}/@nswSiteSettings`,
    },
  };
}
