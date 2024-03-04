import cx from 'classnames';
import { FilterItem } from 'nsw-design-system-plone6/components/Components/Filters/FilterItem';
import { Loader } from 'nsw-design-system-plone6/components/Components/Loader';
import { useIsClient } from 'nsw-design-system-plone6/hooks/useIsClient';
import * as React from 'react';
import { flushSync } from 'react-dom';
import { defineMessages, useIntl } from 'react-intl';

import { Facets } from '@plone/volto/components/manage/Blocks/Search/components';
import { BodyClass } from '@plone/volto/helpers';

const messages = defineMessages({
  facetsTitleDefault: {
    id: 'Filters',
    defaultMessage: 'Filters',
  },
});

function FacetWrapper(facetProps) {
  return <FilterItem {...facetProps}>{facetProps.children}</FilterItem>;
}

function FilterClearButton({ onClick }) {
  return (
    <div className="nsw-filters__cancel">
      <button type="reset" onClick={onClick}>
        Clear all filters
      </button>
    </div>
  );
}

function FilterTitleDisplay({ title }) {
  return <div className="nsw-filters__title">{title}</div>;
}

function FilterMobileControls({ title, onClick }) {
  return (
    <div className="nsw-filters__controls js-filters__count">
      <button onClick={onClick}>
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

function FilterMobileControlsCloseButton({ onClick }) {
  return (
    <div className="nsw-filters__back">
      <button
        className="nsw-icon-button nsw-icon-button--flex js-close-sub-nav"
        type="button"
        onClick={onClick}
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

/**
 * Filters UI from https://digitalnsw.github.io/nsw-design-system/components/filters/index.html.
 *
 * The JavaScript functionality provided by nsw-design-system has been re-implemented in React.
 */
export function Filters({
  data,
  facets,
  querystring,
  liveUpdate = false,
  setFacets = () => {},
  onTriggerSearch = () => {},
  searchedText,
}) {
  const isClient = useIsClient();
  const intl = useIntl();
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  function showFilters() {
    // When using `inPage` mode, we want to toggle it rather than always show it
    setShowMobileFilters(
      data.mobileDisplayMode === 'inPage' ? !showMobileFilters : true,
    );
  }

  function hideFilters() {
    setShowMobileFilters(false);
  }

  function clearFilters(e) {
    e.preventDefault();
    const visibleFacets = data.facets.filter(
      (facet) => facet.displayMode !== 'hidden' && !facet.hidden,
    );

    // TODO: Do we need to avoid clearing hidden facets?
    setFacets({});
  }

  const { facets: dataFacets } = data;
  const facetsTitle =
    data.facetsTitle || intl.formatMessage(messages.facetsTitleDefault);
  const facetsReady =
    querystring.indexes && Object.keys(querystring.indexes).length > 0;

  if (!facetsReady) {
    return <Loader fillWidth={true} />;
  }

  if (!dataFacets || Object.keys(dataFacets).length < 1) {
    return null;
  }

  const numberOfAppliedFacets = Object.keys(facets).length;

  return (
    <BodyClass
      className={
        data.mobileDisplayMode === 'modal' && showMobileFilters
          ? 'filters-open'
          : null
      }
    >
      <div
        className={cx('nsw-filters', {
          'nsw-filters--instant': liveUpdate,
          'js-filters': liveUpdate,
          'nsw-filters--down': data.mobileDisplayMode === 'inPage',
          'nsw-filters--right': data.mobileDisplayMode === 'modal',
          ready: isClient,
          active: showMobileFilters,
        })}
      >
        <FilterMobileControls
          title={
            numberOfAppliedFacets > 0
              ? `${facetsTitle} (${numberOfAppliedFacets})`
              : facetsTitle
          }
          onClick={showFilters}
        />
        <div className="nsw-filters__wrapper">
          {data.mobileDisplayMode === 'modal' ? (
            <FilterMobileControlsCloseButton onClick={hideFilters} />
          ) : null}
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
            facetWrapper={FacetWrapper}
          />
          <FilterClearButton onClick={clearFilters} />
        </div>
      </div>
    </BodyClass>
  );
}
