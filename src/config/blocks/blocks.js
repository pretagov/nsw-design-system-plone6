import {
  gridBlocks,
  nswBlocks,
} from 'nsw-design-system-plone6/config/blocks/blockDefinitions';

const unwantedBlocks = ['teaser', 'teaserGrid'];

function removeFieldsFromBlock(config, blockId, fieldsToRemove) {
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
}

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

function removeUnwantedBlocks(config) {
  unwantedBlocks.forEach((blockId) => {
    delete config.blocks.blocksConfig[blockId];
  });
}

export function applyBlocks(config) {
  // TODO: Custom block groups i18n
  config.blocks.groupBlocksOrder = [
    ...config.blocks.groupBlocksOrder,
    { id: 'nsw', title: 'NSW' },
    { id: 'grids', title: 'Grids' },
  ];

  nswBlocks.forEach((block) => {
    config.blocks.blocksConfig[block.id] = { sidebarTab: 1, ...block };
  });
  gridBlocks.forEach((block) => {
    config.blocks.blocksConfig[block.id] = { sidebarTab: 1, ...block };
  });

  config.blocks.blocksConfig['form'].blockHasOwnFocusManagement = true;

  // Grid block will default to be cards
  config.blocks.blocksConfig['__grid'].gridAllowedBlocks = ['card'];
  // TODO: i18n Grid block custom title
  config.blocks.blocksConfig['__grid'] = {
    ...config.blocks.blocksConfig['__grid'],
    title: 'Card grid',
    group: 'grids',
  };

  removeFieldsFromBlock(config, 'accordion', ['right_arrows', 'non_exclusive']);
  removeVariationsFromBlock(config, 'toc', ['horizontalMenu']);
  removeUnwantedBlocks(config);

  // Remove requirement for titles
  config.blocks.requiredBlocks = [];
}
