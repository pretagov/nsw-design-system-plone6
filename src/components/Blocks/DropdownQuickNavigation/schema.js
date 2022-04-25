import { defineMessages } from 'react-intl';

const messages = defineMessages({
  dropdownTitleFirst: {
    id: 'First dropdown title',
    defaultMessage: 'First dropdown title',
  },
  dropdownTitleSecond: {
    id: 'Second dropdown title',
    defaultMessage: 'Second dropdown title',
  },
  links: {
    id: 'Links',
    defaultMessage: 'Links',
  },
  invert: {
    id: 'Invert colours?',
    defaultMessage: 'Invert colours?',
  },
  dropdownValueFirst: {
    id: 'First dropdown value',
    defaultMessage: 'First dropdown value',
  },
  dropdownValueSecond: {
    id: 'Second dropdown value',
    defaultMessage: 'Second dropdown value',
  },
  link: {
    id: 'Link',
    defaultMessage: 'Link',
  },
});

export function LinkListSchema({ intl }) {
  return {
    title: intl.formatMessage(messages.link),
    required: ['dropdownValueFirst', 'dropdownValueSecond', 'link'],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['dropdownValueFirst', 'dropdownValueSecond', 'link'],
      },
    ],
    properties: {
      dropdownValueFirst: {
        title: intl.formatMessage(messages.dropdownValueFirst),
        type: 'string',
      },
      dropdownValueSecond: {
        title: intl.formatMessage(messages.dropdownValueSecond),
        type: 'string',
      },
      link: {
        title: intl.formatMessage(messages.link),
        widget: 'object_browser',
        mode: 'link',
      },
    },
  };
}

export function DropdownQuickNavigationSchema({ intl }) {
  return {
    required: ['body'],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'dropdownTitleFirst',
          'dropdownTitleSecond',
          'invert',
          'links',
        ],
        required: ['dropdownTitleFirst', 'dropdownTitleSecond', 'links'],
      },
    ],
    properties: {
      dropdownTitleFirst: {
        title: intl.formatMessage(messages.dropdownTitleFirst),
        type: 'string',
      },
      dropdownTitleSecond: {
        title: intl.formatMessage(messages.dropdownTitleSecond),
        type: 'string',
      },
      links: {
        title: intl.formatMessage(messages.links),
        widget: 'object_list',
        schema: LinkListSchema,
      },
      invert: {
        title: intl.formatMessage(messages.invert),
        type: 'boolean',
        default: true,
      },
    },
  };
}
