import sliderSVG from '@plone/volto/icons/slider.svg';
import { defineMessages } from 'react-intl';
// Todo: Setup path imports for blocks
import config from '@plone/volto/registry';
import * as Components from '../components';
import { DropdownQuickNavigationSchema } from '../components/Blocks/DropdownQuickNavigation/schema';
import ListItems from '../customizations/volto/components/manage/Blocks/Search/layout/ListItems';

const messages = defineMessages({
  card: {
    id: 'Card',
    defaultMessage: 'Card',
  },
  listItems: {
    id: 'List Items',
    defaultMessage: 'List Items',
  },
  searchFacetsTitleDefault: {
    id: 'Filter results',
    defaultMessage: 'Filter results',
  },
  searchFullWidthSearchBar: {
    id: 'Full width search bar',
    defaultMessage: 'Full width search bar',
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
      id: 'listItems',
      title: 'List Items',
      template: ListItems,
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

const schemaEnhancers = {
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

  // Remove requirement for titles
  config.blocks.requiredBlocks = [];
};

export default updateBlocksConfig;
