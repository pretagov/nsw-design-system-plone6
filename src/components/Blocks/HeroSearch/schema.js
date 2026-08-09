export function heroSearchSchema() {
  // TODO: Hero schema i18n
  return {
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'description',
          'searchPage',
          'image',
          'accessibleLabelName',
          'inputPlaceholderText',
          'suggestedLinks',
        ],
        required: [],
      },
    ],
    required: [],
    properties: {
      title: {
        title: 'Title',
      },
      description: {
        title: 'Description',
        widget: 'textarea',
      },
      searchPage: {
        title: 'Search page',
        widget: 'object_browser',
        mode: 'link',
        multiple: false,
        default: '/search',
      },
      image: {
        title: 'Image',
        widget: 'file',
      },
      accessibleLabelName: {
        title: 'Accessible label name',
        type: 'string',
      },
      inputPlaceholderText: {
        title: 'Input placeholder text',
        type: 'string',
      },
      suggestedLinks: {
        title: 'Suggested links',
        widget: 'object_list',
        schema: {
          addMessage: 'Add suggestion',
          title: 'Suggestion',
          fieldsets: [
            {
              id: 'default',
              title: 'Default',
              fields: ['title', 'link'],
              required: ['title', 'link'],
            },
          ],
          properties: {
            title: {
              title: 'Title',
            },
            link: {
              title: 'link',
              widget: 'object_browser',
              mode: 'link',
              multiple: false,
            },
          },
        },
      },
    },
  };
}
