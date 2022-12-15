import { composeSchema } from '@plone/volto/helpers';
import sliderSVG from '@plone/volto/icons/slider.svg';
import { defineMessages } from 'react-intl';
// Todo: Setup path imports for blocks
import {
  HeroWithBlocks,
  HeroWithDropdownQuickNavigation,
  HeroWithLinks,
} from 'nsw-design-system-plone6/components/Blocks/Hero';
import * as Components from '../components';
import { CardSchema } from '../components/Blocks/Card';
import { DropdownQuickNavigationSchema } from '../components/Blocks/DropdownQuickNavigation/schema';
import CardListing from '../components/Blocks/Listing/CardListing';
import { SectionSchema } from '../components/Blocks/Section';

const messages = defineMessages({
  card: {
    id: 'Card',
    defaultMessage: 'Card',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  searchFacetsTitleDefault: {
    id: 'Filter results',
    defaultMessage: 'Filter results',
  },
  searchFullWidthSearchBar: {
    id: 'Full width search bar',
    defaultMessage: 'Full width search bar',
  },
  link: {
    id: 'Link',
    defaultMessage: 'Link',
  },
  links: {
    id: 'Links',
    defaultMessage: 'Links',
  },
  linksTitle: {
    id: 'Links title',
    defaultMessage: 'Links title',
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
  heroWidth: {
    id: 'Width',
    defaultMessage: 'Width',
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
    id: 'nsw_linkList',
    title: 'Link list',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.LinkListView,
    edit: Components.LinkListEdit,
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
    id: 'separator',
    title: 'Separator',
    icon: sliderSVG,
    group: 'nsw',
    view: Components.SeparatorView,
    edit: Components.SeparatorEdit,
    restricted: false,
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
      title: 'Default',
      isDefault: true,
    },
    {
      id: 'heroWithLinks',
      title: 'With links',
      template: HeroWithLinks,
      schemaEnhancer: ({ schema, formData, intl }) => {
        schema.properties.linksTitle = {
          title: intl.formatMessage(messages.linksTitle),
          type: 'string',
        };
        schema.properties.links = {
          title: intl.formatMessage(messages.links),
          widget: 'object_list',
          schema: {
            title: intl.formatMessage(messages.link),
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
          },
        };

        const defaultFieldsetIndex = schema.fieldsets.findIndex(
          (fieldset) => fieldset.id === 'default',
        );

        schema.fieldsets[defaultFieldsetIndex].fields = [
          ...schema.fieldsets[defaultFieldsetIndex].fields,
          'linksTitle',
          'links',
        ];
        return schema;
      },
    },
    {
      id: 'heroWithBlocks',
      title: 'With blocks',
      template: HeroWithBlocks,
    },
    {
      id: 'heroWithDropdownQuickNavigation',
      title: 'With quick navigation',
      template: HeroWithDropdownQuickNavigation,
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

const blockVariationsToRemove = {
  search: ['facetsTopSide'],
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
  listing: ({ schema, intl, formData }) => {
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
  toc: ({ schema }) => {
    const fieldsToRemove = ['title', 'hide_title', 'ordered'];
    fieldsToRemove.map((field) => {
      const indexToRemove = schema.fieldsets[0].fields.indexOf(field);
      schema.fieldsets[0].fields.splice(indexToRemove, 1);
      delete schema.properties[field];
    });
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

function removeVariationsFromBlock(config, blockId, variationsToRemove) {
  const blockConfig = config.blocks.blocksConfig[blockId];
  variationsToRemove.forEach((variationToRemove) => {
    const indexToRemove = blockConfig.variations.findIndex(
      (variation) => variation.id === variationToRemove,
    );
    if (indexToRemove === -1) {
      return;
    }
    blockConfig.variations.splice(indexToRemove, 1);
  });
}

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
    config.blocks.blocksConfig[blockId].schemaEnhancer = composeSchema(
      config.blocks.blocksConfig[blockId].schemaEnhancer,
      enhancer,
    );
  });

  removeFieldsFromBlock(config, 'accordion', ['right_arrows', 'non_exclusive']);
  removeVariationsFromBlock(config, 'toc', ['horizontalMenu']);

  // Remove unused block variations
  Object.entries(blockVariationsToRemove).forEach(([blockId, variationIds]) => {
    variationIds.forEach((variationId) => {
      const variationIndex = config.blocks.blocksConfig[
        blockId
      ].variations.findIndex((variation) => {
        return variation.id === variationId;
      });
      config.blocks.blocksConfig[blockId].variations.splice(variationIndex, 1);
    });
  });

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
  Object.keys(config.blocks.blocksConfig).forEach((blockId) => {
    if (blockId === 'nsw_section') {
      return;
    }
    config.blocks.blocksConfig[blockId].schemaEnhancer = composeSchema(
      config.blocks.blocksConfig[blockId].schemaEnhancer,
      withSectionSchema,
    );
  });

  // Remove requirement for titles
  config.blocks.requiredBlocks = [];
};

export default updateBlocksConfig;
