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
  showViewMoreLink: {
    id: 'Show view more link',
    defaultMessage: 'Show view more link',
  },
});

export const contentBlockStylingSchema = ({ intl }) => {
  return {
    required: [],
    fieldsets: [
      {
        id: 'styling',
        title: intl.formatMessage(messages.styling),
        fields: ['imagePosition', 'showViewMoreLink', 'imageIsIcon'],
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
      showViewMoreLink: {
        title: intl.formatMessage(messages.showViewMoreLink),
        type: 'boolean',
        default: true,
      },
      imageIsIcon: {
        title: intl.formatMessage(messages.imageIsIcon),
        type: 'boolean',
        default: false,
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
        fields: ['title', 'description', 'viewMore', 'image'],
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
    },
  };
};
