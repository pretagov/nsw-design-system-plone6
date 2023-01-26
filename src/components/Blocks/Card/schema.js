import { defineMessages } from 'react-intl';

const messages = defineMessages({
  styling: {
    id: 'Styling',
    defaultMessage: 'Styling',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  linkTitle: {
    id: 'Link Title',
    defaultMessage: 'Link',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  shouldHighlightTitle: {
    id: 'Should Highlight Title',
    defaultMessage: 'Highlight card',
  },
  shouldHighlightDescription: {
    id: 'Should Highlight Description',
    defaultMessage: 'Should the card be highlighted?',
  },
  titleIsHeadlineTitle: {
    id: 'Title is headline title',
    defaultMessage: 'Title is a headline',
  },
  titleIsHeadlineDescription: {
    id: 'Title is headline description',
    defaultMessage:
      'Whether the font size of the card title should be increased',
  },
  colour: {
    id: 'Colour',
    defaultMessage: 'Colour',
  },
  image: {
    id: 'Image',
    defaultMessage: 'Image',
  },
  imagePosition: {
    id: 'Image Position',
    defaultMessage: 'Image Position',
  },
});

export const cardStylingSchema = ({ intl }) => {
  return {
    required: [],
    fieldsets: [
      {
        id: 'styling',
        title: intl.formatMessage(messages.styling),
        fields: [
          'shouldHighlight',
          'titleIsHeadline',
          'colour',
          'imagePosition',
        ],
        required: [],
      },
    ],
    properties: {
      shouldHighlight: {
        title: intl.formatMessage(messages.shouldHighlightTitle),
        description: intl.formatMessage(messages.shouldHighlightDescription),
        type: 'boolean',
        default: true,
      },
      titleIsHeadline: {
        title: intl.formatMessage(messages.titleIsHeadlineTitle),
        description: intl.formatMessage(messages.titleIsHeadlineDescription),
        type: 'boolean',
        default: false,
      },
      colour: {
        title: intl.formatMessage(messages.colour),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['white', 'White'],
          ['light', 'Light'],
          ['dark', 'Dark'],
        ],
        default: 'white',
      },
      imagePosition: {
        title: intl.formatMessage(messages.imagePosition),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['hidden', 'Hidden'],
          ['above', 'Above'],
          ['side', 'Beside'],
        ],
        default: 'above',
      },
    },
  };
};

export const singleCardSchema = ({ intl }) => {
  return {
    required: ['title', 'link'],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'description', 'link', 'image'],
        required: ['title', 'link'],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.title),
      },
      description: {
        title: intl.formatMessage(messages.description),
        type: 'string',
        widget: 'richtext',
      },
      link: {
        title: intl.formatMessage(messages.linkTitle),
        widget: 'object_browser',
        mode: 'link',
      },
      image: {
        title: intl.formatMessage(messages.image),
        widget: 'file',
      },
    },
  };
};

export const cardSchema = ({ intl }) => {
  const stylingSchema = cardStylingSchema({ intl });
  const singleSchema = singleCardSchema({ intl });
  return {
    ...singleSchema,
    ...stylingSchema,
  };
};
