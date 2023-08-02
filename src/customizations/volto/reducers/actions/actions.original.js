/**
 * Actions reducer.
 * @module reducers/actions/actions
 */

import { GET_CONTENT, LIST_ACTIONS } from '@plone/volto/constants/ActionTypes';
import {
  flattenToAppURL,
  getBaseUrl,
} from '@plone/volto/helpers';

import { flatten } from 'lodash';
import { matchPath } from 'react-router';
import config from '@plone/volto/registry';
const hasApiExpander = (expander, path = '', type = 'GET_CONTENT',crashMe) => {
  const expanders = config.settings.apiExpanders
  const actualPath = undefined
  const filtered = expanders.filter((expand) => matchPath(actualPath, expand.match) && expand[type])
  const mapped = filtered.map((expand) => expand[type])
  const final = flatten(mapped)
  return final.includes(expander);
};

const initialState = {
  error: null,
  actions: {
    object: [],
    object_buttons: [],
    site_actions: [],
    user: [],
    document_actions: [],
    portal_tabs: [],
  },
  loaded: false,
  loading: false,
};

/**
 * Actions reducer.
 * @function actions
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function actions(state = initialState, action = {}) {
  let hasExpander;
  switch (action.type) {
    case `${LIST_ACTIONS}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_CONTENT}_SUCCESS`:
      hasExpander = hasApiExpander(
        'actions',
        getBaseUrl(flattenToAppURL(action.result['@id'])),
        'GET_CONTENT',
        action
      );
      if (hasExpander) {
        console.log("ACTION RESULT")
        console.log(action.result)
        console.log(action.result['@components'])
        try {
          const value = action.result['@components']
        } catch {
          debugger;
        }

        // return flatten(
        //   config.settings.apiExpanders
        //     .filter((expand) => matchPath(path, expand.match) && expand[type])
        //     .map((expand) => expand[type]),
        // ).includes(expander);

        return {
          ...state,
          error: null,
          actions: action.result['@components'].actions,
          loaded: true,
          loading: false,
        };
      }
      return state;
    case `${LIST_ACTIONS}_SUCCESS`:
      hasExpander = hasApiExpander(
        'actions',
        getBaseUrl(flattenToAppURL(action.result['@id'])),
      );
      if (!hasExpander) {
        return {
          ...state,
          error: null,
          actions: action.result,
          loaded: true,
          loading: false,
        };
      }
      return state;
    case `${LIST_ACTIONS}_FAIL`:
      return {
        ...state,
        error: action.error,
        actions: {},
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
