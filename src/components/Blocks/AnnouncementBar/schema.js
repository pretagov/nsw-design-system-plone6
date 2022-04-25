import { defineMessages } from 'react-intl';

const messages = defineMessages({
  body: {
    id: 'Body',
    defaultMessage: 'Body',
  },
  colour: {
    id: 'Colour',
    defaultMessage: 'Colour',
  },
});

export function announcementBarSchema({ intl }) {
  return {
    required: ['body'],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['body', 'colour'],
        required: ['body'],
      },
    ],
    properties: {
      body: {
        title: intl.formatMessage(messages.body),
        type: 'string',
        widget: 'richtext',
      },
      colour: {
        title: intl.formatMessage(messages.colour),
        type: 'string',
        factory: 'Choice',
        default: 'dark',
        choices: [
          ['dark', 'Dark'],
          ['light', 'Light'],
          ['supplementary', 'Supplementary'],
          ['accent', 'Accent'],
        ],
      },
    },
  };
}
