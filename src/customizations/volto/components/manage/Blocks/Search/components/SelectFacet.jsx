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

  let value = props.value?.value ?? props.value;

  if (value.length === 0) {
    value = facet.multiple ? [] : '';
  }

  return (
    <Select
      options={choices}
      onChange={(event) => {
        // TODO: Fix handling of 'all' button and 'Please select' button
        if (facet.multiple) {
          const multiWrapperElement = event.target.parentElement;
          const selectedOptions = multiWrapperElement.querySelectorAll(
            '[aria-selected="true"]',
          );

          if (!selectedOptions) {
            onChange(facet.field.value, []);
            return;
          }
          onChange(
            facet.field.value,
            [...selectedOptions].map(
              (optionElement) => optionElement.dataset.value,
            ),
          );
          return;
        }

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
      multipleTitle={facetTitle}
      required={facet.facetRequired}
      value={value}
    />
  );
};

SelectFacet.schemaEnhancer = selectFacetSchemaEnhancer;
SelectFacet.stateToValue = selectFacetStateToValue;
SelectFacet.valueToQuery = selectFacetValueToQuery;

export default SelectFacet;
