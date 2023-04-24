export const updateApiExpandersConfig = (config) => {
  config.settings.apiExpanders = [
    ...config.settings.apiExpanders,
    {
      match: '',
      GET_CONTENT: ['actions'],
    },
  ];

  return config;
};

export default updateApiExpandersConfig;
