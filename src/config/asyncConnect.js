import { getBaseUrl } from '@plone/volto/helpers';
import { getNswSiteSettings } from '../actions';

export const updateAsyncConnectConfig = (config) => {
  config.settings.asyncPropsExtenders = [
    ...(config.settings.asyncPropsExtenders ?? []),
    {
      path: '/',
      extend: (dispatchActions) => {
        if (
          dispatchActions.filter(
            (asyncAction) => asyncAction.key === 'nswSiteSettings',
          ).length === 0
        ) {
          dispatchActions.push({
            key: 'nswSiteSettings',
            promise: async ({ location, store: { dispatch } }) => {
              __SERVER__ &&
                (await dispatch(
                  getNswSiteSettings(getBaseUrl(location.pathname)),
                ));
            },
          });
        }
        return dispatchActions;
      },
    },
  ];
};

export default updateAsyncConnectConfig;
