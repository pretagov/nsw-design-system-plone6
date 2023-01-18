import { defineMessages } from 'react-intl';
const messages = defineMessages({
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  copy: {
    id: 'Copy',
    defaultMessage: 'Copy',
  },
  links: {
    id: 'Links',
    defaultMessage: 'Links',
  },
  link: {
    id: 'Link',
    defaultMessage: 'Link',
  },
  viewMore: {
    id: 'View more',
    defaultMessage: 'View more',
  },
  image: {
    id: 'Image',
    defaultMessage: 'Image',
  },
  imageIsIcon: {
    id: 'Image is icon',
    defaultMessage: 'Image is icon',
  },
  // Styling schema
  styling: {
    id: 'Styling',
    defaultMessage: 'Styling',
  },
  imagePosition: {
    id: 'Image Position',
    defaultMessage: 'Image Position',
  },
});

const LinkListSchema = ({ intl }) => {
  return {
    title: intl.formatMessage(messages.link),
    required: ['title', 'link'],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'link'],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
      },
      link: {
        title: intl.formatMessage(messages.link),
        widget: 'object_browser',
        mode: 'link',
      },
    },
  };
};

export const contentBlockStylingSchema = ({ intl }) => {
  return {
    required: [],
    fieldsets: [
      {
        id: 'styling',
        title: intl.formatMessage(messages.styling),
        fields: ['imagePosition'],
        required: [],
      },
    ],
    properties: {
      imagePosition: {
        title: intl.formatMessage(messages.imagePosition),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['hidden', 'Hidden'],
          ['above', 'Above'],
          // ['side', 'Beside'],
        ],
        default: 'above',
      },
    },
  };
};

export const contentBlockSchema = ({ intl }) => {
  return {
    required: ['title', 'copy'],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'description',
          'links',
          'viewMore',
          'image',
          'imageIsIcon',
        ],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
      },
      description: {
        title: intl.formatMessage(messages.copy),
        type: 'string',
        widget: 'richtext',
      },
      // links: {
      //   title: intl.formatMessage(messages.links),
      //   widget: 'object_list',
      //   schema: LinkListSchema,
      // },
      link: {
        title: intl.formatMessage(messages.viewMore),
        widget: 'object_browser',
        mode: 'link',
      },
      image: {
        title: intl.formatMessage(messages.image),
        widget: 'file',
        mode: 'image',
      },
      imageIsIcon: {
        title: intl.formatMessage(messages.imageIsIcon),
        type: 'boolean',
        default: false,
      },
    },
  };
};
