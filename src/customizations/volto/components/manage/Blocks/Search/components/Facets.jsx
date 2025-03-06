// Passed the information about the current facet down the facet wrapper in `<FacetWrapper>`
// Passed the value of the current facet down the facet wrapper in `<FacetWrapper>`

import {
  hasDateOperation,
  hasNonValueOperation,
} from '@plone/volto/components/manage/Blocks/Search/utils';
import { resolveExtension } from '@plone/volto/helpers/Extensions/withBlockExtensions';
import config from '@plone/volto/registry';
import React from 'react';

const showFacet = (index) => {
  const { values } = index;
  return index
    ? hasNonValueOperation(index.operations || []) ||
      hasDateOperation(index.operations || [])
      ? true
      : values && Object.keys(values).length > 0
    : values && Object.keys(values).length > 0;
};

const Facets = (props) => {
  const {
    querystring,
    data = {},
    facets,
    setFacets,
    facetWrapper,
    isEditMode,
  } = props;
  const { search } = config.blocks.blocksConfig;

  const FacetWrapper = facetWrapper;
  const query_to_values = Object.assign(
    {},
    ...(data?.query?.query?.map(({ i, v }) => ({ [i]: v })) || []),
  );

  return (
    <>
      {data?.facets
        ?.filter((facetSettings) => !facetSettings.hidden)
        .map((facetSettings) => {
          const field = facetSettings?.field?.value;
          const index = querystring.indexes[field] || {};
          const { values = {} } = index;

          let choices = Object.keys(values)
            .map((name) => ({
              value: name,
              label: values[name].title,
            }))
            // filter the available values based on the allowed values in the
            // base query
            .filter(({ value }) =>
              query_to_values[field]
                ? query_to_values[field].includes(value)
                : true,
            );

          // TODO: Inefficient, buts works.
          choices = index.values_order
            ? index.values_order.reduce((validChoices, valueToFind) => {
                const choice = choices.find((choice) => choice.value === valueToFind)
                if (choice) {
                  validChoices.push(choice)
                }
                return validChoices;
              }, [])
            : choices.sort((a, b) =>
                a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }),
              );

          const isMulti = facetSettings.multiple;
          let selectedValue = facets[facetSettings?.field?.value];

          const defaultValue = facetSettings.defaultValue;

          if (!selectedValue && defaultValue) {
            selectedValue = isMulti ? [defaultValue] : defaultValue;
          }

          // TODO :handle changing the type of facet (multi/nonmulti)

          const { view: FacetWidget, stateToValue } = resolveExtension(
            'type',
            search.extensions.facetWidgets.types,
            facetSettings,
          );

          let value = stateToValue({ facetSettings, index, selectedValue });

          const {
            rewriteOptions = (name, options) => options,
          } = search.extensions.facetWidgets;

          return FacetWrapper && (isEditMode || showFacet(index)) ? (
            <FacetWrapper
              key={facetSettings['@id']}
              facet={facetSettings}
              value={value}
            >
              <FacetWidget
                facet={facetSettings}
                choices={rewriteOptions(facetSettings?.field?.value, choices)}
                isMulti={isMulti}
                value={value}
                isEditMode={isEditMode}
                onChange={(id, value) => {
                  !isEditMode && setFacets({ ...facets, [id]: value });
                }}
              />
            </FacetWrapper>
          ) : (
            ''
          );
        })}
    </>
  );
};

export default Facets;
