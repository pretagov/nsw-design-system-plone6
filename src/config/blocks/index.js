import { applyBlocks } from 'nsw-design-system-plone6/config/blocks/blocks';
import { applySchemaEnhancers } from 'nsw-design-system-plone6/config/blocks/schemaEnhancers';
import { applyVariations } from 'nsw-design-system-plone6/config/blocks/variations';

export const updateBlocksConfig = (config) => {
  applyBlocks(config);
  applySchemaEnhancers(config);
  applyVariations(config);
};

export default updateBlocksConfig;
