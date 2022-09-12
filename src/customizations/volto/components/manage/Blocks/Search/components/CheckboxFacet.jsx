import {
  selectFacetSchemaEnhancer,
  selectFacetStateToValue,
  selectFacetValueToQuery,
} from '@plone/volto/components/manage/Blocks/Search/components/base';
import React from 'react';

const CheckboxFacet = (props) => {
  const { facet, choices, isMulti, onChange, value, isEditMode } = props;
  const facetValue = value;

  // Todo: Toggling a checkbox will currently re-render the entire list.
  return (
    <fieldset className="nsw-form__fieldset" disabled={isEditMode}>
      <legend className="nsw-form__legend">{facet.title}</legend>
      {choices.map(({ label, value }) => {
        const choiceHtmlId = `filters-${facet.title}-${value}`;
        return (
          <React.Fragment key={value}>
            <input
              className={
                isMulti ? 'nsw-form__checkbox-input' : 'nsw-form__radio-input'
              }
              type={isMulti ? 'checkbox' : 'radio'}
              name={`filters-${facet.title}`}
              value={value}
              id={choiceHtmlId}
              checked={
                isMulti
                  ? !!facetValue?.find((f) => f.value === value)
                  : facetValue && facetValue.value === value
              }
              onChange={(e) => {
                const checked = e.target.checked;
                onChange(
                  facet.field.value,
                  isMulti
                    ? [
                        ...facetValue
                          .filter((f) => f.value !== value)
                          .map((f) => f.value),
                        ...(checked ? [value] : []),
                      ]
                    : checked
                    ? value
                    : null,
                );
              }}
            />
            <label
              className={
                isMulti ? 'nsw-form__checkbox-label' : 'nsw-form__radio-label'
              }
              htmlFor={choiceHtmlId}
            >
              {label}
            </label>
          </React.Fragment>
        );
      })}
    </fieldset>
  );
};

CheckboxFacet.schemaEnhancer = selectFacetSchemaEnhancer;
CheckboxFacet.stateToValue = selectFacetStateToValue;
CheckboxFacet.valueToQuery = selectFacetValueToQuery;

export default CheckboxFacet;
