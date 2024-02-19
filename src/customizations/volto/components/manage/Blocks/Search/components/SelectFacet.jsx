import {
  selectFacetSchemaEnhancer,
  selectFacetStateToValue,
  selectFacetValueToQuery,
} from '@plone/volto/components/manage/Blocks/Search/components/base';

import { Select } from 'nsw-design-system-plone6/components/Components/Form/Select';

const SelectFacet = (props) => {
  const { facet, choices, onChange, isEditMode } = props;

  const { title: facetLabel, '@id': facetId } = facet;
  const selectHtmlId = `filters-${facetId}`;

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
      title={facet.displayMode === 'collapsed' ? false : facetLabel}
      disabled={isEditMode}
    />
  );
};

SelectFacet.schemaEnhancer = selectFacetSchemaEnhancer;
SelectFacet.stateToValue = selectFacetStateToValue;
SelectFacet.valueToQuery = selectFacetValueToQuery;

export default SelectFacet;
