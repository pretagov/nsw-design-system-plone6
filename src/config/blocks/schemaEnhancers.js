import { composeSchema } from '@plone/volto/helpers';
import voltoConfig from '@plone/volto/registry';
import {
  cardStylingSchema,
  contentBlockStylingSchema,
} from 'nsw-design-system-plone6/components';
import { SectionSchema } from 'nsw-design-system-plone6/components/Blocks/Section';
import { gridBlocks } from 'nsw-design-system-plone6/config/blocks/blockDefinitions';
import { defineMessages } from 'react-intl';
import { hasKeywordOperation, hasNonValueOperation } from './utils';

const messages = defineMessages({
  // Media schema
  size: {
    id: 'Size',
    defaultMessage: 'Size',
  },
  caption: {
    id: 'Caption',
    defaultMessage: 'Caption',
  },
  captionBackgroundColour: {
    id: 'Caption background colour',
    defaultMessage: 'Caption background colour',
  },
  // Hero block
  heroWidth: {
    id: 'Width',
    defaultMessage: 'Width',
  },
  // Search block
  searchFacetsTitleDefault: {
    id: 'Filter results',
    defaultMessage: 'Filter results',
  },
  searchFacetsDisplayMode: {
    id: 'Display mode',
    defaultMessage: 'Display mode',
  },
  searchFacetsMaxFilters: {
    id: 'Maximum filter options to show',
    defaultMessage: 'Initial options',
  },
  searchFacetsWidget: {
    id: 'Title for facet widget selected',
    defaultMessage: 'Widget',
  },
  searchFacetsRequired: {
    id: 'Title for facet widget required option',
    defaultMessage: 'Required',
  },
  searchFullWidthSearchBar: {
    id: 'Full width search bar',
    defaultMessage: 'Full width search bar',
  },
});

const schemaEnhancers = {
  __grid: ({ schema: schemaToUpdate, intl, formData }) => {
    return asGridSchemaExtender({
      schema: schemaToUpdate,
      intl,
      formData,
      stylingSchema: cardStylingSchema,
    });
  },
  contentBlockGrid: ({ schema: schemaToUpdate, intl, formData }) => {
    return asGridSchemaExtender({
      schema: schemaToUpdate,
      intl,
      formData,
      stylingSchema: contentBlockStylingSchema,
    });
  },
  cardCarousel: ({ schema: schemaToUpdate, intl, formData }) => {
    let schema = schemaToUpdate;
    schema = asGridSchemaExtender({
      schema: schemaToUpdate,
      intl,
      formData,
      stylingSchema: cardStylingSchema,
      removeHeadline: false,
    });
    const defaultFieldsetIndex = schema.fieldsets.findIndex(
      (fieldset) => fieldset.id === 'default',
    );

    // Add columns property
    schema.properties.columns = {
      title: 'Columns',
      widget: 'grid_columns_widget',
    };
    schema.fieldsets[defaultFieldsetIndex].fields = [
      ...schema.fieldsets[defaultFieldsetIndex].fields,
      'columns',
    ];

    // Add mode property
    schema.properties.mode = {
      title: 'Mode',
      type: 'string',
      factory: 'Choice',
      choices: [
        ['fixed', 'Fixed'],
        ['loop', 'Looping'],
        ['paginated', 'Paginated'],
      ],
      placeholder: 'Fixed',
      noValueOption: false,
    };
    schema.fieldsets[defaultFieldsetIndex].fields = [
      ...schema.fieldsets[defaultFieldsetIndex].fields,
      'mode',
    ];

    return schema;
  },
  image: ({ schema, intl, formData }) => {
    return asMediaSchemaExtender(schema, intl, formData);
  },
  listing: ({ schema: originalSchema, intl, formData }) => {
    const schema = withListingDisplayControls({
      schema: originalSchema,
      intl,
      formData,
    });
    schema.properties.noResultsMessage = {
      // TODO: Listing schemaEnhancer noResultsMessage title, description and placeholder
      title: 'No results message',
      description:
        'Customise the message to display when no results are found. Leave blank for default',
      placeholder: intl.formatMessage({
        id: 'No results found.',
        defaultMessage: 'No results found.',
      }),
      widget: 'richtext',
    };
    const defaultFieldsetIndex = schema.fieldsets.findIndex(
      (fieldset) => fieldset.id === 'default',
    );
    schema.fieldsets[defaultFieldsetIndex].fields = [
      ...schema.fieldsets[defaultFieldsetIndex].fields,
      'noResultsMessage',
    ];
    return schema;
  },
  hero: ({ schema, intl }) => {
    schema.properties.heroWidth = {
      title: intl.formatMessage(messages.heroWidth),
      type: 'string',
      factory: 'Choice',
      // TODO: i18n hero width choices
      choices: [
        ['default', 'Default'],
        ['wide', 'Wide'],
        ['extraWide', 'Extra wide'],
      ],
      default: 'default',
    };
    const defaultFieldsetIndex = schema.fieldsets.findIndex(
      (fieldset) => fieldset.id === 'default',
    );
    schema.fieldsets[defaultFieldsetIndex].fields = [
      ...schema.fieldsets[defaultFieldsetIndex].fields,
      'heroWidth',
    ];
    schema.fieldsets[defaultFieldsetIndex].required = [
      ...(schema.fieldsets[defaultFieldsetIndex]?.fields ?? []),
      'heroWidth',
    ];
    return schema;
  },
  search: ({ schema: originalSchema, intl, formData }) => {
    const schema = withListingDisplayControls({
      schema: originalSchema,
      intl,
      formData,
    });

    schema.properties.fullWidthSearchBar = {
      type: 'boolean',
      title: intl.formatMessage(messages.searchFullWidthSearchBar),
      default: false,
    };
    schema.properties.queryType = {
      title: 'Search type',
      type: 'string',
      factory: 'Choice',
      choices: [
        ['contains', 'Standard search'],
        ['search', 'Advanced search'],
      ],
      default: 'contains',
    };

    const facetsFieldset = schema.fieldsets.find(
      (fieldset) => fieldset.id === 'facets',
    );
    facetsFieldset.fields = [
      'facetRequired',
      'facetsTitle',
      'mobileDisplayMode',
      'facets',
    ]; // Added `mobileDisplayMode`
    schema.properties.mobileDisplayMode = {
      title: intl.formatMessage(messages.searchFacetsDisplayMode),
      type: 'string',
      factory: 'Choice',
      choices: [
        // TODO: i18n of mobile display mode choices
        ['inPage', 'In page'],
        ['modal', 'Modal'],
      ],
      default: 'inPage',
    };

    // Change 'hide facet' checkbox to a 'Facet display mode' option
    const facetSchema = schema.properties.facets.schema;
    facetSchema.fieldsets[0].fields = [
      'field',
      'title',
      'type',
      'displayMode',
      'maxFilters',
      'facetRequired',
    ]; // Remove 'hidden', add 'displayMode', add `maximumFilters`, add 'facetRequired'
    // TODO: INTL for `Facet widget` being changed to `Widget`
    facetSchema.properties.type.title = intl.formatMessage(
      messages.searchFacetsWidget,
    );

    facetSchema.properties.maxFilters = {
      title: intl.formatMessage(messages.searchFacetsMaxFilters),
      type: 'number',
      default: 5,
    };
    facetSchema.properties.facetRequired = {
      title: intl.formatMessage(messages.searchFacetsRequired),
      type: 'boolean',
    };

    facetSchema.properties.displayMode = {
      title: intl.formatMessage(messages.searchFacetsDisplayMode),
      type: 'string',
      factory: 'Choice',
      choices: [
        // TODO: i18n of facet display mode choices
        ['open', 'Always open'],
        ['collapsed', 'Collapsed'],
        ['hidden', 'Hidden'],
      ],
      default: 'open',
    };

    // 0 is the 'default' fieldset
    schema.fieldsets[0].fields = [
      ...schema.fieldsets[0].fields,
      'fullWidthSearchBar',
    ];

    const query = schema.fieldsets.findIndex(
      (fieldset) => fieldset.id === 'searchquery',
    );
    schema.fieldsets[query].fields = [
      'queryType',
      ...schema.fieldsets[query].fields,
    ];

    return schema;
  },
  toc: ({ schema }) => {
    const fieldsToRemove = ['title', 'hide_title', 'ordered'];
    fieldsToRemove.forEach((field) => {
      const indexToRemove = schema.fieldsets[0].fields.indexOf(field);
      schema.fieldsets[0].fields.splice(indexToRemove, 1);
      delete schema.properties[field];
    });
    return schema;
  },
  video: ({ schema, intl, formData }) => {
    return asMediaSchemaExtender(schema, intl, formData);
  },
};

const alignmentPositionSizeMapping = {
  center: [
    ['fullWidth', 'Full width'],
    ['90', '90%'],
    ['80', '80%'],
    ['70', '70%'],
    ['60', '60%'],
  ],
  left: [
    ['50', '50%'],
    ['40', '40%'],
    ['30', '30%'],
  ],
  right: [
    ['50', '50%'],
    ['40', '40%'],
    ['30', '30%'],
  ],
};

export function withSectionSchema({ schema, formData, intl }) {
  const sectionSchema = SectionSchema({
    intl,
    formData,
  });
  schema.properties = {
    ...schema.properties,
    ...sectionSchema.properties,
  };
  const defaultFieldsetIndex = sectionSchema.fieldsets.findIndex(
    (fieldset) => fieldset.id === 'default',
  );
  const sectionFieldset = {
    id: 'sectionFieldset',
    title: 'Section',
    fields: [
      ...sectionSchema.fieldsets[defaultFieldsetIndex].fields.filter(
        (fieldId) => !['title', 'description'].includes(fieldId),
      ),
    ],
  };
  schema.fieldsets = [...schema.fieldsets, sectionFieldset];
  return schema;
}

function withListingDisplayControls({ schema, formData, intl }) {
  schema.properties.clickableArea = {
    title: 'Clickable area',
    type: 'string',
    factory: 'Choice',
    choices: [
      ['title', 'Title only'],
      ['block', 'All of item'],
    ],
    default: 'title',
  };

  schema.properties.showLabel = {
    title: 'Show label',
    type: 'boolean',
  };
  schema.properties.showDescription = {
    title: 'Show description',
    type: 'boolean',
    default: true,
  };
  schema.properties.showUrl = {
    title: 'Show URL',
    type: 'boolean',
  };
  schema.properties.showDate = {
    title: 'Show date',
    type: 'boolean',
  };
  schema.properties.showTags = {
    title: 'Show tags',
    type: 'boolean',
  };
  // Below check needed so we don't overwrite the card settings
  schema.properties.imagePosition = schema.properties.imagePosition
    ? schema.properties.imagePosition
    : {
        title: 'Image position',
        type: 'string',
        factory: 'Choice',
        choices: [
          ['hidden', 'Hidden'],
          ['left', 'Left'],
          ['right', 'Right'],
        ],
        default: 'hidden',
      };
  schema.properties.dateField = {
    title: 'Date field',
    type: 'string',
    factory: 'Choice',
    vocabulary: { '@id': 'plone.app.vocabularies.MetadataFields' },
  };
  schema.properties.labelField = {
    title: 'Label field',
    default: 'Type',
    type: 'string',
    factory: 'Choice',
    widget: 'select_querystring_field',
    filterOptions: (options) => {
      return Object.assign(
        {},
        ...Object.keys(options).map((k) =>
          Object.keys(options[k].values || {}).length ||
          hasNonValueOperation(options[k].operations)
            ? { [k]: options[k] }
            : {},
        ),
      );
    },
  };

  schema.properties.tagField = {
    title: 'Tag field(s)',
    //default: [{label: 'Tag', value: 'Subject'}],
    type: 'array',
    factory: 'List',
    widget: 'select_querystring_field',
    vocabulary: { '@id': 'collective.indexvocabularies.KeywordIndexes' },
    filterOptions: (options) => {
      return Object.assign(
        {},
        ...Object.keys(options).map((k) =>
          Object.keys(options[k].values || {}).length ||
          hasNonValueOperation(options[k].operations) ||
          hasKeywordOperation(options[k].operations)
            ? { [k]: options[k] }
            : {},
        ),
      );
    },
  };

  const itemDisplayFieldset = {
    id: 'listingDisplayFieldset',
    title: 'Item Settings',
    fields: [
      'showDescription',
      'showLabel',
      ...(formData.showLabel ? ['labelField'] : []),
      'showUrl',
      'showTags',
      ...(formData.showTags ? ['tagField'] : []),
      'showDate',
      ...(formData.showDate ? ['dateField'] : []),
      ...(formData.variation !== 'cardListing'
        ? ['imagePosition', 'clickableArea']
        : []),
    ],
    required: [],
  };
  schema.fieldsets.push(itemDisplayFieldset);
  return schema;
}

function asGridSchemaExtender({
  schema,
  intl,
  stylingSchema,
  removeHeadline = true,
}) {
  const defaultFieldsetIndex = schema.fieldsets.findIndex(
    (fieldset) => fieldset.id === 'default',
  );
  if (removeHeadline) {
    // Remove 'Headline' from the grid block
    schema.fieldsets[defaultFieldsetIndex].fields = schema.fieldsets[
      defaultFieldsetIndex
    ].fields.filter((fieldId) => fieldId !== 'headline');
    delete schema.properties.headline;
  } else {
    schema.properties.headline.title = 'Heading';
  }

  if (!schema.properties['@type']) {
    const allowedBlock =
      voltoConfig.blocks.blocksConfig[schema.block].gridAllowedBlocks[0];
    // Add a 'grid selector'
    schema.properties['@type'] = {
      title: 'Grid type',
      type: 'string',
      factory: 'Choice',
      choices: [
        ['__grid', voltoConfig.blocks.blocksConfig['__grid'].title],
        ...gridBlocks.map((block) => [block.id, block.title]),
      ],
      default: allowedBlock,
    };
    schema.fieldsets[0].fields.unshift('@type');
  }

  // Add display options
  const stylingSchemaObject = stylingSchema({
    intl,
  });
  schema.properties = {
    ...schema.properties,
    ...stylingSchemaObject.properties,
  };
  // TODO: Content block schema enhancer title
  const variationFieldset = {
    id: 'stylingVariation',
    title: 'Display Settings',
    fields: [...stylingSchemaObject.fieldsets[0].fields],
    required: [...stylingSchemaObject.fieldsets[0].required],
  };
  schema.fieldsets.push(variationFieldset);

  return schema;
}

function asMediaSchemaExtender(schema, intl, formData) {
  schema.properties.align.actions = ['center', 'left', 'right'];
  schema.properties.size = {
    title: intl.formatMessage(messages.size),
    type: 'string',
    factory: 'Choice',
    choices: formData.align
      ? alignmentPositionSizeMapping[formData.align]
      : alignmentPositionSizeMapping['center'],
    default: formData.align
      ? alignmentPositionSizeMapping[formData.align][0]
      : 'fullWidth',
    value: formData.size
      ? formData.size
      : formData.align
      ? alignmentPositionSizeMapping[formData.align][0]
      : 'fullWidth',
  };
  schema.properties.caption = {
    title: intl.formatMessage(messages.caption),
    type: 'string',
  };
  schema.properties.captionBackgroundColour = {
    title: intl.formatMessage(messages.captionBackgroundColour),
    type: 'string',
    factory: 'Choice',
    choices: [
      ['dark', 'Dark'],
      ['light', 'Light'],
      ['grey', 'Grey'],
      ['transparent', 'No background'],
    ],
    default: 'grey',
  };
  // TODO: 0 is the 'default' fieldset, but should look it up for safety.
  schema.fieldsets[0].fields = [
    ...schema.fieldsets[0].fields,
    'caption',
    'captionBackgroundColour',
  ];
  if (!schema.fieldsets[0].fields.includes('size')) {
    schema.fieldsets[0].fields = [...schema.fieldsets[0].fields, 'size'];
  }
  return schema;
}

export function applySchemaEnhancers(config) {
  Object.entries(schemaEnhancers).forEach(([blockId, enhancer]) => {
    if (!config.blocks.blocksConfig[blockId]) {
      return;
    }
    config.blocks.blocksConfig[blockId].schemaEnhancer = composeSchema(
      config.blocks.blocksConfig[blockId].schemaEnhancer,
      enhancer,
      withSectionSchema,
    );
  });
}
