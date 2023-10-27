import {
  selectFacetSchemaEnhancer,
  selectFacetStateToValue,
  selectFacetValueToQuery,
} from '@plone/volto/components/manage/Blocks/Search/components/base';

const SelectFacet = (props) => {
  const { facet, choices, onChange, isEditMode } = props;

  const { title: facetLabel, '@id': facetId } = facet;
  const selectHtmlId = `filters-${facetId}`;

  return (
    <>
      <label className="nsw-form__label" htmlFor={selectHtmlId}>
        {facetLabel}
      </label>
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <select
        className="nsw-form__select"
        id={selectHtmlId}
        name={selectHtmlId}
        onChange={(event) => {
          const newValue = event.target?.value;
          if (!newValue) {
            onChange(facet.field.value, []);
            return;
          }
          onChange(facet.field.value, [newValue]);
        }}
        disabled={isEditMode}
      >
        {choices.map(({ value, label }) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </>
  );
};

SelectFacet.schemaEnhancer = selectFacetSchemaEnhancer;
SelectFacet.stateToValue = selectFacetStateToValue;
SelectFacet.valueToQuery = selectFacetValueToQuery;

export default SelectFacet;
