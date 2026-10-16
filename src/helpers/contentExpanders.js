import { GET_CONTENT } from '@plone/volto/constants/ActionTypes';

/**
 * Feed an expanded component of the main content response into a reducer.
 *
 * The site-wide endpoints (`@siteinfo`, `@subfooter`, `@nswSiteSettings`) come
 * back in `@components` of the content request instead of their own requests
 * (see `config/apiExpanders.js`). This passes the component to the endpoint's
 * existing reducer as its own `_SUCCESS` action, so their state and selectors
 * stay the same.
 *
 * @param {Function} reducer The endpoint's reducer.
 * @param {string} component The expander name, the key in `@components`.
 * @param {string} actionType The endpoint's action type, e.g. `GET_SITEINFO`.
 * @param {Function} toResult Turns the component into the endpoint's response.
 * @returns {Function} The wrapped reducer.
 */
export function withContentExpander(
  reducer,
  component,
  actionType,
  toResult = (data) => data,
) {
  return (state, action = {}) => {
    if (action.type === `${GET_CONTENT}_SUCCESS` && !action.subrequest) {
      const data = action.result?.['@components']?.[component];
      // Not expanded, the component is only its `@id`
      if (data && Object.keys(data).some((key) => key !== '@id')) {
        return reducer(state, {
          type: `${actionType}_SUCCESS`,
          result: toResult(data),
        });
      }
    }
    return reducer(state, action);
  };
}

/**
 * The expanded `nswSiteSettings` without its `@id`, as `@nswSiteSettings` returns it.
 */
export function nswSiteSettingsFromComponent({ '@id': id, ...settings }) {
  return settings;
}

/**
 * The expanded `subfooter` items, as `@subfooter` returns them.
 */
export function subfooterFromComponent({ items }) {
  return items ?? [];
}
