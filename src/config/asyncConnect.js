// Fetched by volto-siteinfo and volto-subfooter on every server-side render.
// They come with the content request now (see `apiExpanders.js`).
const EXPANDED_ASYNC_ITEMS = ['siteInfo', 'subfooter'];

/**
 * Drop the site-wide fetches that the content expansion replaces, and only
 * fetch `@workflow` for logged-in users: anonymous users get a 401, and only
 * the toolbar uses it.
 */
export function updateAsyncItems(asyncItems) {
  return asyncItems
    .filter((item) => !EXPANDED_ASYNC_ITEMS.includes(item.key))
    .map((item) => {
      if (item.key !== 'workflow') {
        return item;
      }
      return {
        ...item,
        promise: (options) => {
          if (!options.store.getState().userSession?.token) {
            return;
          }
          return item.promise(options);
        },
      };
    });
}

export const updateAsyncConnectConfig = (config) => {
  config.settings.asyncPropsExtenders = [
    ...(config.settings.asyncPropsExtenders ?? []),
    {
      path: '/',
      extend: updateAsyncItems,
    },
  ];
};

export default updateAsyncConnectConfig;
