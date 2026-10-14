export const updateApiExpandersConfig = (config) => {
  config.settings.apiExpanders = [
    ...(config.settings.apiExpanders ?? []),
    {
      match: '',
      GET_CONTENT: [
        'actions',
        'breadcrumbs',
        'navigation',
        // Site-wide settings, instead of a request each per server-side render.
        // Read in `reducers.js`.
        'siteinfo',
        'subfooter',
        'nswSiteSettings',
      ],
      querystring: {
        'expand.navigation.depth': config.settings.navDepth,
      },
    },
  ];

  return config;
};

export default updateApiExpandersConfig;
