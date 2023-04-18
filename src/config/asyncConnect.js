import { getBaseUrl } from '@plone/volto/helpers';
import { getNswSiteSettings } from '../actions';

export const updateAsyncConnectConfig = (config) => {
  config.settings.asyncPropsExtenders = [
    ...(config.settings.asyncPropsExtenders ?? []),
    {
      path: '/',
      extend: (dispatchActions) => {
        const nswSiteSettings = {
          key: 'nswSiteSettings',
          promise: ({ location, store: { dispatch } }) => {
            if (!__SERVER__) {
              return;
            }
            const action = getNswSiteSettings(getBaseUrl(location.pathname));
            return dispatch(action).catch((e) => {
              // eslint-disable-next-line
              console.log('Error getting nswSiteSettings');
            });
          },
        };
        return [...dispatchActions, nswSiteSettings];
      },
    },
  ];
};

export default updateAsyncConnectConfig;
