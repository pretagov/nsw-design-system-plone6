export function globalAlertSchema({ intl }) {
  return {
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'description', 'buttonText', 'url'],
        required: ['title'],
      },
    ],
    required: [],
    properties: {
      title: {
        title: intl.formatMessage({
          id: 'Title',
          defaultMessage: 'Title',
        }),
      },
      description: {
        title: intl.formatMessage({
          id: 'Description',
          defaultMessage: 'Description',
        }),
      },
      buttonText: {
        title: intl.formatMessage({
          id: 'Button text',
          defaultMessage: 'Button text',
        }),
      },
      url: {
        title: intl.formatMessage({
          id: 'Link',
          defaultMessage: 'Link',
        }),
        widget: 'url',
      },
    },
  };
}
