import { defineMessages } from 'react-intl';
const messages = defineMessages({
  link: {
    id: 'Link',
    defaultMessage: 'Link',
  },
  links: {
    id: 'Links',
    defaultMessage: 'Links',
  },
});

function LinkSchema({ intl }) {
  return {
    title: intl.formatMessage(messages.link),
    required: ['link'],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['link'],
        required: ['link'],
      },
    ],
    properties: {
      link: {
        title: intl.formatMessage(messages.link),
        widget: 'object_browser',
        mode: 'link',
        multiple: false,
      },
    },
  };
}

export function linkListSchema({ intl }) {
  return {
    required: [],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['links'],
        required: [],
      },
    ],
    properties: {
      // Using a sub-schema for a nicer UI for selecting
      links: {
        title: intl.formatMessage(messages.links),
        widget: 'object_list',
        schema: LinkSchema,
      },
    },
  };
}
