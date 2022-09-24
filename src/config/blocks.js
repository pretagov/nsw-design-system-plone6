import sliderSVG from '@plone/volto/icons/slider.svg';
import { defineMessages } from 'react-intl';
// Todo: Setup path imports for blocks
import config from '@plone/volto/registry';
import * as Components from '../components';
import { CardSchema } from '../components/Blocks/Card';
import { DropdownQuickNavigationSchema } from '../components/Blocks/DropdownQuickNavigation/schema';
import CardListing from '../components/Blocks/Listing/CardListing';

const messages = defineMessages({
  card: {
    id: 'Card',
    defaultMessage: 'Card',
  },
  searchFacetsTitleDefault: {
    id: 'Filter results',
    defaultMessage: 'Filter results',
  },
  searchFullWidthSearchBar: {
    id: 'Full width search bar',
    defaultMessage: 'Full width search bar',
  },
  imageSettings: {
    id: 'Image settings',
    defaultMessage: 'Image settings',
  },
  imagePosition: {
    id: 'Image position',
    defaultMessage: 'Image position',
  },
  // Card listing schema
  numberOfColumns: {
    id: 'Number of columns',
    defaultMessage: 'Number of columns',
  },
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
});

// Todo: i18n for component titles and groups
const nswBlocks = [
  {
    id: 'nsw_announcementBar',
    title: 'Announcement Bar',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.AnnouncementBarView,
    edit: Components.AnnouncementBarEdit,
    restricted: false,
    mostUsed: true,
    security: {
      addPermission: [],
      view: [],
    },
  },
  {
    id: 'card',
    title: 'Card',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.CardView,
    edit: Components.CardEdit,
    restricted: false,
    mostUsed: true,
    security: {
      addPermission: [],
      view: [],
    },
  },
  {
    id: 'contentBlock',
    title: 'Content block',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.ContentBlockView,
    edit: Components.ContentBlockEdit,
    restricted: false,
    mostUsed: false,
    security: {
      addPermission: [],
      view: [],
    },
  },
  {
    id: 'callout',
    title: 'Callout',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.CalloutView,
    edit: Components.CalloutEdit,
    restricted: false,
    mostUsed: false,
    security: {
      addPermission: [],
      view: [],
    },
  },
  {
    id: 'nsw_dropdownQuickNavigation',
    title: 'Dropdown quick navigation',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.DropdownQuickNavigationView,
    edit: Components.DropdownQuickNavigationEdit,
    restricted: false,
    mostUsed: true,
    security: {
      addPermission: [],
      view: [],
    },
  },
  {
    id: 'nsw_inPageAlert',
    title: 'In-page Alert',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.InPageAlertView,
    edit: Components.InPageAlertEdit,
    restricted: false,
    mostUsed: true,
    security: {
      addPermission: [],
      view: [],
    },
  },
  {
    id: 'nsw_section',
    title: 'Section',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.SectionView,
    edit: Components.SectionEdit,
    restricted: false,
    mostUsed: true,
    security: {
      addPermission: [],
      view: [],
    },
  },
  {
    id: 'nsw_sidebar',
    title: 'Sidebar',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.SidebarView,
    edit: Components.SidebarEdit,
    restricted: false,
    mostUsed: true,
    security: {
      addPermission: [],
      view: [],
    },
  },
];

const blockVariations = {
  listing: [
    {
      id: 'cardListing',
      title: 'Card list',
      template: CardListing,
    },
  ],
  hero: [
    {
      id: 'default',
      isDefault: true,
      title: 'Default',
      template: null,
    },
    {
      id: 'heroWithDropdownQuickNavigation',
      title: 'With quick navigation',
      // template: () => <p>Hello world!</p>,
      template: Components.DropdownQuickNavigationView,
      schemaEnhancer: ({ schema, formData, intl }) => {
        const dropdownQuickNavigationSchema = DropdownQuickNavigationSchema({
          intl,
        });
        schema.properties = {
          ...schema.properties,
          ...dropdownQuickNavigationSchema.properties,
        };
        const variationFieldset = {
          id: 'dropdownQuickNavVariation',
          title: 'Quick Navigation Settings',
          fields: [...dropdownQuickNavigationSchema.fieldsets[0].fields],
          required: [...dropdownQuickNavigationSchema.fieldsets[0].required],
        };
        schema.fieldsets.push(variationFieldset);
        return schema;
      },
    },
  ],
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
      ['transparent', 'No background'],
    ],
  };
  // TODO: 0 is the 'default' fieldset, but should look it up for safety.
  schema.fieldsets[0].fields = [...schema.fieldsets[0].fields, 'caption'];
  if (!schema.fieldsets[0].fields.includes('size')) {
    schema.fieldsets[0].fields = [...schema.fieldsets[0].fields, 'size'];
  }
  return schema;
}

const schemaEnhancers = {
  video: ({ schema, intl, formData }) => {
    return asMediaSchemaExtender(schema, intl, formData);
  },
  image: ({ schema, intl, formData }) => {
    return asMediaSchemaExtender(schema, intl, formData);
  },
  search: ({ schema, intl }) => {
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
};

// Add schema enhancers to specific variations of existing blocks
const variationSchemaEnhancers = {
  listing: {
    cardListing: ({ schema, intl }) => {
      // Add the card display settings to the listing settings
      const cardSchema = CardSchema({
        intl,
      });
      schema.properties = {
        ...schema.properties,
        ...cardSchema.properties,
      };
      const stylingFieldsetIndex = 1;
      const variationFieldset = {
        id: 'cardListingVariation',
        title: 'Card Display Settings',
        fields: [...cardSchema.fieldsets[stylingFieldsetIndex].fields],
        required: [...cardSchema.fieldsets[stylingFieldsetIndex].required],
      };
      schema.fieldsets.push(variationFieldset);

      // Add the custom settings
      schema.properties.numberOfColumns = {
        title: intl.formatMessage(messages.numberOfColumns),
        type: 'number',
        minimum: 1,
        maximum: 4,
        default: 3,
      };
      // 0 is the default fieldset
      schema.fieldsets[0].fields = [
        ...schema.fieldsets[0].fields,
        'numberOfColumns',
      ];

      return schema;
    },
    imageGallery: ({ schema, intl }) => {
      const imageSettingFieldset = {
        id: 'imageSettings',
        title: intl.formatMessage(messages.imageSettings),
        fields: ['imagePosition'],
      };
      schema.properties.imagePosition = {
        title: intl.formatMessage(messages.imagePosition),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['left', 'Left'],
          ['right', 'Right'],
        ],
        default: 'left',
      };
      schema.fieldsets = [...schema.fieldsets, imageSettingFieldset];
      return schema;
    },
  },
};

const blockAllowedInGrid = ['card', 'contentBlock', 'callout'];

const removeFieldsFromBlock = (config, blockId, fieldsToRemove) => {
  // Remove the unused fields from the accordion after overriding it's view
  config.blocks.blocksConfig[blockId].schemaEnhancer = ({ schema }) => {
    const wantedFields = schema.fieldsets[1].fields.filter((field) => {
      if (!fieldsToRemove.includes(field)) {
        return true;
      }
      delete schema.properties[field];
      return false;
    });
    schema.fieldsets[1].fields = wantedFields;

    return schema;
  };
};

export const updateBlocksConfig = (config) => {
  // Add 'NSW' group
  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    { id: 'nsw', title: 'NSW' },
  ];

  // Add new blocks
  nswBlocks.forEach((block) => {
    config.blocks.blocksConfig[block.id] = { sidebarTab: 1, ...block };
  });

  Object.entries(blockVariations).forEach(([blockId, variations]) => {
    config.blocks.blocksConfig[blockId].variations = [
      ...(config.blocks.blocksConfig[blockId].variations ?? []),
      ...variations,
    ];
  });

  // Needs to be kept up to date with any new blocks
  config.blocks.blocksConfig['__grid'].gridAllowedBlocks = [
    ...config.blocks.blocksConfig['__grid'].gridAllowedBlocks,
    ...blockAllowedInGrid,
  ];

  Object.entries(schemaEnhancers).forEach(([blockId, enhancer]) => {
    config.blocks.blocksConfig[blockId].schemaEnhancer = enhancer;
  });

  removeFieldsFromBlock(config, 'accordion', ['right_arrows', 'non_exclusive']);

  // Add the schema enhancer for each variation in each block that needs to be customised
  Object.entries(variationSchemaEnhancers).forEach(([blockId, variation]) => {
    Object.entries(variation).forEach(([variationId, schemaEnhancer]) => {
      // const schemaEnhancer = variationSchemaEnhancers.blockId.variationId;
      const variationIndex = config.blocks.blocksConfig[
        blockId
      ].variations.findIndex((variation) => {
        return variation.id === variationId;
      });
      config.blocks.blocksConfig[blockId].variations[
        variationIndex
      ].schemaEnhancer = schemaEnhancer;
    });
  });

  // Remove requirement for titles
  config.blocks.requiredBlocks = [];
};

export default updateBlocksConfig;
