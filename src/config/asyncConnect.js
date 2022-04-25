import { getBaseUrl } from '@plone/volto/helpers';
import { getSiteInfo } from '../actions';

export const updateAsyncConnectConfig = (config) => {
  config.settings.asyncPropsExtenders = [
    ...(config.settings.asyncPropsExtenders ?? []),
    {
      path: '/',
      extend: (dispatchActions) => {
        if (
          dispatchActions.filter(
            (asyncAction) => asyncAction.key === 'siteInfo',
          ).length === 0
        ) {
          dispatchActions.push({
            key: 'siteInfo',
            promise: ({ location, store: { dispatch } }) => {
              __SERVER__ &&
                dispatch(getSiteInfo(getBaseUrl(location.pathname)));
            },
          });
        }
        return dispatchActions;
      },
    },
  ];
};

export default updateAsyncConnectConfig;
