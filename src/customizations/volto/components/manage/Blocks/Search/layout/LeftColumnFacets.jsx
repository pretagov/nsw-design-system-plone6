import {
  FilterList,
  SearchDetails,
  SearchInput,
  SortOn,
} from '@plone/volto/components/manage/Blocks/Search/components';
import config from '@plone/volto/registry';
import cx from 'classnames';
import { flushSync } from 'react-dom';

import { Filters } from 'nsw-design-system-plone6/components/Components/Filters/Filters';

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
    isEditMode,
    querystring = {},
    // searchText, // search text currently being entered (controlled input)
    // searchData,
    // mode = 'view',
    // variation,
  } = props;
  const { showSearchButton } = data;
  const isLive = !showSearchButton;
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
      <div className="nsw-layout">
        <div className="nsw-layout__sidebar">
          <Filters
            data={data}
            facets={facets}
            liveUpdate={isLive}
            querystring={querystring}
            setFacets={setFacets}
            onTriggerSearch={onTriggerSearch}
            searchedText={searchedText}
          />
        </div>
        <div className="nsw-layout__main">
          <div className="nsw-results-bar">
            <SearchDetails total={totalItems} batchSize={batchSize} />

            {data.showSortOn && (
              <SortOn
                querystring={querystring}
                searchedText={searchedText}
                data={data}
                isEditMode={isEditMode}
                sortOn={sortOn}
                sortOrder={sortOrder}
                setSortOn={(sortOn) => {
                  flushSync(() => {
                    setSortOn(sortOn);
                    onTriggerSearch(searchedText || '', facets, sortOn);
                  });
                }}
                setSortOrder={(sortOrder) => {
                  flushSync(() => {
                    setSortOrder(sortOrder);
                    onTriggerSearch(
                      searchedText || '',
                      facets,
                      sortOn,
                      sortOrder,
                    );
                  });
                }}
              />
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LeftColumnFacets;
