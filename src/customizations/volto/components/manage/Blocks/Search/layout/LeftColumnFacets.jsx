import {
  Facets,
  FilterList,
  SearchDetails,
  SearchInput,
  SortOn,
} from '@plone/volto/components/manage/Blocks/Search/components';
import config from '@plone/volto/registry';
import cx from 'classnames';
import React from 'react';
import { flushSync } from 'react-dom';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  searchButtonText: {
    id: 'Search',
    defaultMessage: 'Search',
  },
});

const FacetWrapper = ({ children }) => (
  <div className="nsw-filters__item">{children}</div>
);

const LeftColumnFacets = (props) => {
  const {
    children,
    data,
    totalItems,
    facets,
    setFacets,
    setSortOn,
    setSortOrder,
    sortOn,
    sortOrder,
    onTriggerSearch,
    searchedText, // search text for previous search
    searchText, // search text currently being entered (controlled input)
    isEditMode,
    querystring = {},
    // searchData,
    // mode = 'view',
    // variation,
  } = props;
  const { showSearchButton } = data;
  const isLive = !showSearchButton;
  const intl = useIntl();
  const batchSize = data.query?.b_size || config.settings.defaultPageSize;

  return (
    <div className="searchBlock-facets left-column-facets">
      <div className="nsw-layout">
        {(Object.keys(data).includes('showSearchInput')
          ? data.showSearchInput
          : true) && (
          <>
            <div className="nsw-layout__main">
              {data.headline}
              <SearchInput {...props} isLive={isLive} />
            </div>
            {!data.fullWidthSearchBar ? (
              <div className="nsw-layout__sidebar nsw-layout__sidebar--desktop"></div>
            ) : null}
          </>
        )}
      </div>
      <div className={cx('nsw-layout', { 'nsw-filters--instant': isLive })}>
        {data.facets && Object.keys(data.facets).length !== 0 ? (
          <>
            <div className="nsw-layout__sidebar">
              <div className="nsw-filters">
                <div className="nsw-filters__wrapper">
                  <div className="nsw-filters__title">{data.facetsTitle}</div>
                  <Facets
                    querystring={querystring}
                    data={data}
                    facets={facets}
                    setFacets={(f) => {
                      flushSync(() => {
                        setFacets(f);
                        onTriggerSearch(searchedText || '', f);
                      });
                    }}
                    facetWrapper={FacetWrapper}
                  />
                  <div className="nsw-filters__cancel">
                    <button type="reset">Clear all filters</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        <div className="nsw-layout__main">
          <div className="nsw-results-bar">
            <SearchDetails total={totalItems} batchSize={batchSize} />

            {data.showSortOn && (
              <SortOn
                querystring={querystring}
                data={data}
                isEditMode={isEditMode}
                sortOn={sortOn}
                sortOrder={sortOrder}
                updateSort={({ sortOn, sortOrder }) => {
                  setSortOn(sortOn);
                  setSortOrder(sortOrder);
                  onTriggerSearch(searchedText || '', facets, sortOn);
                  onTriggerSearch(
                    searchedText || '',
                    facets,
                    sortOn,
                    sortOrder,
                  );
                }}
              />
            )}
          </div>
          <FilterList
            {...props}
            isEditMode={isEditMode}
            setFacets={(f) => {
              flushSync(() => {
                setFacets(f);
                onTriggerSearch(searchedText || '', f);
              });
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default LeftColumnFacets;
