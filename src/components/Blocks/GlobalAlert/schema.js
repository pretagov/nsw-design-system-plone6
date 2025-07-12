export function globalAlertSchema({ intl }) {
  return {
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'description', 'buttonText', 'url', 'state'],
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
      state: {
        title: intl.formatMessage({
          id: 'State',
          defaultMessage: 'state',
        }),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['information', 'Information'],
          ['light', 'Light'],
          ['critical', 'Critical'],
        ],
        default: 'information',
      },
    },
  };
}
