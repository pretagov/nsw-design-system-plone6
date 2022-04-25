import { defineMessages } from 'react-intl';

const messages = defineMessages({
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  contents: {
    id: 'Contents',
    defaultMessage: 'Contents',
  },
  icon: {
    id: 'Icon',
    defaultMessage: 'Icon',
  },
});

export const calloutSchema = ({ intl }) => {
  return {
    required: [],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'contents'],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
        description: intl.formatMessage(messages.title),
      },
      contents: {
        title: intl.formatMessage(messages.contents),
        type: 'string',
        widget: 'richtext',
      },
      // TODO: Better support for SVG icons. Need to be able to set a class
      // icon: {
      //   title: intl.formatMessage(messages.icon),
      //   widget: 'file',
      //   mode: 'image',
      // },
    },
  };
};

export default calloutSchema;
