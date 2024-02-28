import loadable from '@loadable/component';
import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

import { Facets } from '@plone/volto/components/manage/Blocks/Search/components';
import cx from 'classnames';

import { FilterItem } from 'nsw-design-system-plone6/components/Components/Filters/FilterItem';
import { Loader } from 'nsw-design-system-plone6/components/Components/Loader';

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

function FilterMobileControls({ title }) {
  return (
    <div className="nsw-filters__controls js-filters__count">
      <button>
        <span
          className="material-icons nsw-material-icons"
          focusable="false"
          aria-hidden="true"
        >
          tune
        </span>
        <span>{title}</span>
        <span
          className="material-icons nsw-material-icons"
          focusable="false"
          aria-hidden="true"
        >
          keyboard_arrow_right
        </span>
      </button>
    </div>
  );
}

function FilterMobileControlsCloseButton() {
  return (
    <div className="nsw-filters__back">
      <button
        className="nsw-icon-button nsw-icon-button--flex js-close-sub-nav"
        type="button"
      >
        <span
          className="material-icons nsw-material-icons"
          focusable="false"
          aria-hidden="true"
        >
          close
        </span>
        <span className="sr-only">Close filters</span>
      </button>
    </div>
  );
}

export function Filters({
  data,
  facets,
  querystring,
  liveUpdate = false,
  setFacets = () => {},
  onTriggerSearch = () => {},
  searchedText,
}) {
  const facetsRef = useRef(null);
  const facetsController = useRef(null);

  const { facets: dataFacets, facetsTitle } = data;
  const facetsReady =
    querystring.indexes && Object.keys(querystring.indexes).length > 0;

  useEffect(() => {
    // Check we've initialized the facets controller as well as got an
    //   index before we try to setup the UI with NSW JS
    if (facetsRef.current && facetsReady && facetsController.current?.default) {
      // debugger;
      facetsController.current = new facetsController.current.default(
        facetsRef.current,
      );
      facetsController.current.init();
    }
  }, [facetsReady]);

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

  if (!facetsReady) {
    return <Loader fillWidth={true} />;
  }

  if (!dataFacets || Object.keys(dataFacets).length < 1) {
    return null;
  }

  return (
    <div>
      <div
        ref={facetsRef}
        className={cx('nsw-filters', {
          'nsw-filters--instant': liveUpdate,
          'js-filters': liveUpdate,
          'nsw-filters--down': data.mobileDisplayMode === 'inPage',
          'nsw-filters--right': data.mobileDisplayMode === 'modal',
        })}
      >
        <FilterMobileControls title={facetsTitle} />
        <div className="nsw-filters__wrapper">
          <FilterMobileControlsCloseButton />
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
    </div>
  );
}
