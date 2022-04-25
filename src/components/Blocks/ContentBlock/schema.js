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

export const contentBlockSchema = ({ intl }) => {
  return {
    required: ['title', 'copy'],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'copy', 'links', 'viewMore', 'image', 'imageIsIcon'],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
      },
      copy: {
        title: intl.formatMessage(messages.copy),
        widget: 'textarea',
      },
      links: {
        title: intl.formatMessage(messages.links),
        widget: 'object_list',
        schema: LinkListSchema,
      },
      viewMore: {
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

export default contentBlockSchema;
