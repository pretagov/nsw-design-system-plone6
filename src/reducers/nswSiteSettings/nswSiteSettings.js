import { flattenToAppURL } from '@plone/volto/helpers';

import { GET_NSWSITESETTINGS } from '../../constants/ActionTypes';

const initialState = {
  error: null,
  loaded: false,
  loading: false,
};

export default function siteInfo(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_NSWSITESETTINGS}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_NSWSITESETTINGS}_SUCCESS`:
      return {
        ...state,
        data: action.result,
        error: null,
        loaded: true,
        loading: false,
      };
    case `${GET_NSWSITESETTINGS}_FAIL`:
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
