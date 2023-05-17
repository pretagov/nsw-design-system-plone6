export const updateApiExpandersConfig = (config) => {
  config.settings.apiExpanders = [
    {
      match: '',
      GET_CONTENT: ['actions', 'breadcrumbs', 'navigation'],
      querystring: {
        'expand.navigation.depth': config.settings.navDepth,
      },
    },
  ];

  return config;
};

export default updateApiExpandersConfig;
