import { composeSchema } from '@plone/volto/helpers';
import voltoConfig from '@plone/volto/registry';
import {
  cardStylingSchema,
  contentBlockStylingSchema,
} from 'nsw-design-system-plone6/components';
import { SectionSchema } from 'nsw-design-system-plone6/components/Blocks/Section';
import { gridBlocks } from 'nsw-design-system-plone6/config/blocks/blockDefinitions';
import { defineMessages } from 'react-intl';

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
    schema.properties.facetsTitle.default = intl.formatMessage(
      messages.searchFacetsTitleDefault,
    );
    schema.properties.fullWidthSearchBar = {
      type: 'boolean',
      title: intl.formatMessage(messages.searchFullWidthSearchBar),
      default: false,
    };
    // 0 is the 'default' fieldset
    schema.fieldsets[0].fields = [
      ...schema.fieldsets[0].fields,
      'fullWidthSearchBar',
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

function withSectionSchema({ schema, formData, intl }) {
  const sectionSchema = SectionSchema({
    intl,
    formData,
  });
  schema.properties = {
    ...schema.properties,
    ...sectionSchema.properties,
  };
  const defaultFieldsetIndex = schema.fieldsets.findIndex(
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
    choices: [
      ['CreationDate', 'Creation date'],
      ['EffectiveDate', 'Publication date'],
      ['ModificationDate', 'Last modified'],
      ['ExpirationDate', 'Expiration date'],
    ],
    default: 'EffectiveDate',
  };
  const itemDisplayFieldset = {
    id: 'listingDisplayFieldset',
    title: 'Item Settings',
    fields: [
      'showDescription',
      'showUrl',
      'showTags',
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

function asGridSchemaExtender({ schema, intl, formData, stylingSchema }) {
  const defaultFieldsetIndex = schema.fieldsets.findIndex(
    (fieldset) => fieldset.id === 'default',
  );
  // Remove 'Headline' from the grid block
  schema.fieldsets[defaultFieldsetIndex].fields = schema.fieldsets[
    defaultFieldsetIndex
  ].fields.filter((fieldId) => fieldId !== 'headline');
  delete schema.properties.headline;

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
    schema.fieldsets[0].fields.push('@type');
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
    config.blocks.blocksConfig[blockId].schemaEnhancer = composeSchema(
      config.blocks.blocksConfig[blockId].schemaEnhancer,
      enhancer,
      withSectionSchema,
    );
  });
}
