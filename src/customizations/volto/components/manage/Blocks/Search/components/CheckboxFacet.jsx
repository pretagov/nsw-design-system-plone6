import {
  selectFacetSchemaEnhancer,
  selectFacetStateToValue,
  selectFacetValueToQuery,
} from '@plone/volto/components/manage/Blocks/Search/components/base';
import cx from 'classnames';
import { useIsClient } from 'nsw-design-system-plone6/hooks/useIsClient';

import * as React from 'react';

const CheckboxFacet = (props) => {
  const isClient = useIsClient();
  // const filterItemContext = React.useContext(FilterItemContext);
  const [showAll, enableShowAll] = React.useReducer(() => true, false);

  const { facet, choices = [], isMulti, onChange, value, isEditMode } = props;
  const facetTitle = facet.title || '';
  const facetValue = value;
  const maximumFacets = facet.maxFilters;
  const visibleChoices = choices.slice(0, maximumFacets);
  const hiddenChoices = choices.slice(maximumFacets);

  // Todo: Toggling a checkbox will currently re-render the entire list.
  return (
    <fieldset className="nsw-form__fieldset" disabled={isEditMode}>
      {facet.displayMode === 'collapsed' ? null : (
        <legend className="nsw-form__legend">{facet.title}</legend>
      )}
      {visibleChoices.map(({ label, value }) => {
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
      {hiddenChoices.length > 0 ? (
        // TODO: This was updated to use nsw-display-none rather than hidden from nsw-design-system@3.12 onwards
        <>
          <div
            className={cx('nsw-filters__all', {
              'nsw-display-none': isClient && !showAll ? true : null,
            })}
          >
            {hiddenChoices.map(({ label, value }) => {
              const choiceHtmlId = `filters-${facet.title}-${value}`;
              return (
                <React.Fragment key={value}>
                  <input
                    className={
                      isMulti
                        ? 'nsw-form__checkbox-input'
                        : 'nsw-form__radio-input'
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
                      isMulti
                        ? 'nsw-form__checkbox-label'
                        : 'nsw-form__radio-label'
                    }
                    htmlFor={choiceHtmlId}
                  >
                    {label}
                  </label>
                </React.Fragment>
              );
            })}
          </div>
          <button
            className={cx('nsw-filters__more', {
              'nsw-display-none': isClient && showAll ? true : null,
            })}
            onClick={enableShowAll}
          >
            Show all {facetTitle.toLowerCase()} (9)
          </button>
        </>
      ) : null}
    </fieldset>
  );
};

CheckboxFacet.schemaEnhancer = selectFacetSchemaEnhancer;
CheckboxFacet.stateToValue = selectFacetStateToValue;
CheckboxFacet.valueToQuery = selectFacetValueToQuery;

export default CheckboxFacet;
