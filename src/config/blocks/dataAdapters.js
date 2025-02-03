import { isEmpty } from 'lodash';

export const searchBlockDataAdapter = ({
  block,
  data,
  id,
  onChangeBlock,
  value,
  props,
}) => {
  let dataSaved = {
    ...data,
    [id]: value,
  };
  if (id === 'facets' && !isEmpty(value) && !data.title && !data.description) {
    value.forEach((facet, index) => {
      if (facet.facetRequired) {
        const querystringIndex = facet.field.value;
        const defaultValue =
          props.querystring.indexes[querystringIndex]?.values_order[0];

        if (defaultValue) {
          dataSaved[id][index].defaultValue = defaultValue;
        }
      }
    });
  }
  onChangeBlock(block, dataSaved);
};

const dataAdapterBlockMapping = {
  search: searchBlockDataAdapter,
};

export function applyDataAdapters(config) {
  Object.entries(dataAdapterBlockMapping).forEach(([blockId, adapter]) => {
    if (!config.blocks.blocksConfig[blockId]) {
      return;
    }
    config.blocks.blocksConfig[blockId].dataAdapter = adapter;
  });
}
