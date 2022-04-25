import React from 'react';
/**
 * A list of active filtered values and controls to clear those filters.
 *
 */
const FilterList = (props) => {
  const { data = {}, facets = {}, setFacets } = props;
  const definedFacets = data.facets || [];

  const totalFilters = definedFacets.filter(
    ({ field }) =>
      field && Object.keys(facets).includes(field.value) && facets[field.value],
  ).length;

  function removeFilter({ facet, value }) {
    if (Array.isArray(facets[facet])) {
      facets[facet].splice(facets[facet].indexOf(value), 1);
      setFacets(facets);
    } else {
      delete facets[facet];
    }
  }

  return totalFilters ? (
    <div class="nsw-m-y-md">
      {data.facets?.map((facetSettings, i) => {
        const facet = facetSettings?.field?.value;
        if (!facet) return null;
        const facetValue = facets[facet];

        if (!facetValue || !facetValue.length > 0) {
          return null;
        }

        return (
          <div
            key={i}
            className="nsw-p-xs"
            style={{
              width: '100%',
              backgroundColor: i % 2 === 0 ? 'var(--nsw-off-white)' : null,
            }}
          >
            {Object.keys(facets).includes(facet) && !!facets[facet] && (
              <div className="filter-list-group" key={i}>
                <span className="label-title nsw-p-right-sm">
                  {facetSettings.title ?? facetSettings?.field?.label}
                </span>
                {Array.isArray(facets[facet]) ? (
                  facets[facet].map((value) => {
                    return (
                      <button
                        onClick={() => {
                          removeFilter({ facet: facet, value: value });
                        }}
                        type="button"
                        className="nsw-button nsw-button--dark-outline-solid"
                      >
                        <span>{value}</span>
                        <span
                          className="material-icons nsw-material-icons"
                          focusable="false"
                          aria-hidden="true"
                        >
                          close
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <button
                    type="button"
                    className="nsw-button nsw-button--dark-outline-solid"
                  >
                    <span>{facets[facet]}</span>
                    <span
                      className="material-icons nsw-material-icons"
                      focusable="false"
                      aria-hidden="true"
                    >
                      close
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  ) : null;
};

export default FilterList;
