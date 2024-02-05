import loadable from '@loadable/component';
import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

import { Facets } from '@plone/volto/components/manage/Blocks/Search/components';
import cx from 'classnames';

import { FilterItem } from 'nsw-design-system-plone6/components/Components/Filters/FilterItem';

function FilterClearButton() {
  return (
    <div className="nsw-filters__cancel">
      <button type="reset">Clear all filters</button>
    </div>
  );
}

function FilterTitleDisplay({ title }) {
  return <div className="nsw-filters__title">{title}</div>;
}

export function Filters({
  data,
  querystring,
  liveUpdate = false,
  setFacets = () => {},
  onTriggerSearch = () => {},
  searchedText,
}) {
  const { facets, facetsTitle } = data;

  const facetsRef = useRef(null);
  const facetsController = useRef(null);
  if (__CLIENT__ && !facetsController.current && facetsRef) {
    loadable(() => import('nsw-design-system/src/components/filters/filters'), {
      ssr: false,
    })
      .load()
      .then((navigation) => {
        if (!facetsController.current) {
          // Save the module for now so we can delay element checking until the querystrings
          //   have been fetched and the facets displayed
          facetsController.current = navigation;
        }
      });
  }

  useEffect(() => {
    // Check we've initialized the facets controller as well as got an
    //   index before we try to setup the UI with NSW JS
    if (
      querystring.indexes &&
      Object.keys(querystring.indexes).length > 0 &&
      facetsController.current.default
    ) {
      facetsController.current = new facetsController.current.default(
        facetsRef.current,
      );
      facetsController.current.init();
    }
  }, [querystring.indexes]);

  if (!facets || Object.keys(facets).length < 1) {
    return null;
  }

  return (
    <>
      <div
        ref={facetsRef}
        className={cx('nsw-filters', {
          'nsw-filters--instant': liveUpdate,
          'js-filters': liveUpdate,
        })}
      >
        <div className="nsw-filters__wrapper">
          <FilterTitleDisplay title={facetsTitle} />
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
            facetWrapper={FilterItem}
          />
          <FilterClearButton />
        </div>
      </div>
    </>
  );
}
