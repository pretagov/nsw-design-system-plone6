import { GET_SITEINFO } from '../../constants/ActionTypes';

export function getSiteInfo(url) {
  return {
    type: GET_SITEINFO,
    request: {
      op: 'get',
      path: `${url}/@siteinfo`,
    },
  };
}
