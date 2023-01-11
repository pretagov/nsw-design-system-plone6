import { singleCardSchema } from 'nsw-design-system-plone6/components';

import { DropdownQuickNavigationSchema } from 'nsw-design-system-plone6/components/Blocks/DropdownQuickNavigation/schema';
import {
  HeroWithBlocks,
  HeroWithDropdownQuickNavigation,
  HeroWithLinks,
} from 'nsw-design-system-plone6/components/Blocks/Hero';
import { CardListing } from 'nsw-design-system-plone6/components/Blocks/Listing/CardListing';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
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

// Add schema enhancers to specific variations of existing blocks
const variationSchemaEnhancers = {
  listing: {
    cardListing: ({ schema, intl }) => {
      // Add the card display settings to the listing settings
      const cardSchemaObject = singleCardSchema({
        intl,
      });
      schema.properties = {
        ...schema.properties,
        ...cardSchemaObject.properties,
      };
      const stylingFieldsetIndex = 1;
      const variationFieldset = {
        id: 'cardListingVariation',
        title: 'Card Display Settings',
        fields: [...cardSchemaObject.fieldsets[stylingFieldsetIndex].fields],
        required: [
          ...cardSchemaObject.fieldsets[stylingFieldsetIndex].required,
        ],
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

const blockVariationsToRemove = {
  search: ['facetsTopSide'],
};
export function applyVariations(config) {
  // Add new block variations
  Object.entries(blockVariations).forEach(([blockId, variations]) => {
    config.blocks.blocksConfig[blockId].variations = [
      ...(config.blocks.blocksConfig[blockId].variations ?? []),
      ...variations,
    ];
  });

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
}
