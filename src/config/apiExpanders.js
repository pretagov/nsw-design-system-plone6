export const updateApiExpandersConfig = (config) => {
  config.settings.apiExpanders = [
    {
      match: '',
      GET_CONTENT: ['actions', 'breadcrumbs'],
    },
  ];

  return config;
};

export default updateApiExpandersConfig;
