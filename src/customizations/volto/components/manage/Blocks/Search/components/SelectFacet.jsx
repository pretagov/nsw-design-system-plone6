import { getTitleForFacet } from 'nsw-design-system-plone6/components/Components/Filters/helpers';
import { Select } from 'nsw-design-system-plone6/components/Components/Form/Select';

import {
  selectFacetSchemaEnhancer,
  selectFacetStateToValue,
  selectFacetValueToQuery,
} from '@plone/volto/components/manage/Blocks/Search/components/base';

const SelectFacet = (props) => {
  const { facet, choices, onChange, isEditMode } = props;
  const facetTitle = getTitleForFacet(facet);
  const selectHtmlId = `filters-${facet['@id']}`;

  return (
    <Select
      options={choices}
      onChange={(event) => {
        const newValue = event.target?.value;
        if (!newValue) {
          onChange(facet.field.value, []);
          return;
        }
        onChange(facet.field.value, [newValue]);
      }}
      id={selectHtmlId}
      title={facet.displayMode === 'collapsed' ? false : facetTitle}
      disabled={isEditMode}
      multiple={facet.multiple}
    />
  );
};

SelectFacet.schemaEnhancer = selectFacetSchemaEnhancer;
SelectFacet.stateToValue = selectFacetStateToValue;
SelectFacet.valueToQuery = selectFacetValueToQuery;

export default SelectFacet;
