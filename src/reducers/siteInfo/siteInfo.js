import { flattenToAppURL } from '@plone/volto/helpers';

import { GET_SITEINFO } from '../../constants/ActionTypes';

const initialState = {
  error: null,
  loaded: false,
  loading: false,
};

export default function siteInfo(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_SITEINFO}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_SITEINFO}_SUCCESS`:
      return {
        ...state,
        ...{
          ...action.result,
          '@id': flattenToAppURL(action.result['@id']),
          logo_url: flattenToAppURL(action.result.logo_url),
          navigation_root: action.result.navigation_root,
        },
        error: null,
        loaded: true,
        loading: false,
      };
    case `${GET_SITEINFO}_FAIL`:
      return {
        ...state,
        error: action.error,
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
