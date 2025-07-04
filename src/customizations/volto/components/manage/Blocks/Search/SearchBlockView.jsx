/**
 * Backport https://github.com/plone/volto/pull/5339s
 * Updated imports to use absolute path
 */
import React from 'react';

import ListingBody from '@plone/volto/components/manage/Blocks/Listing/ListingBody';
import { withBlockExtensions } from '@plone/volto/helpers';

import config from '@plone/volto/registry';

import {
  withQueryString,
  withSearch,
} from '@plone/volto/components/manage/Blocks/Search/hocs';
import { isEqual, isFunction } from 'lodash';
import { useSelector } from 'react-redux';
import { compose } from 'redux';

const getListingBodyVariation = (data) => {
  const { variations } = config.blocks.blocksConfig.listing;

  let variation = data.listingBodyTemplate
    ? variations.find(({ id }) => id === data.listingBodyTemplate)
    : variations.find(({ isDefault }) => isDefault);

  if (!variation) variation = variations[0];

  return variation;
};

const isfunc = (obj) => isFunction(obj) || typeof obj === 'function';

const _filtered = (obj) =>
  Object.assign(
    {},
    ...Object.keys(obj).map((k) => {
      const reject = k !== 'properties' && !isfunc(obj[k]);
      return reject ? { [k]: obj[k] } : {};
    }),
  );

const blockPropsAreChanged = (prevProps, nextProps) => {
  const prev = _filtered(prevProps);
  const next = _filtered(nextProps);

  return isEqual(prev, next);
};

const applyDefaults = (data, root) => {
  const defaultQuery = [
    {
      i: 'path',
      o: 'plone.app.querystring.operation.string.absolutePath',
      v: root || '/',
    },
  ];

  const searchBySearchableText = data.query.filter(
    (item) => item['i'] === 'SearchableText',
  ).length;

  const sort_on = data?.sort_on
    ? { sort_on: data.sort_on }
    : searchBySearchableText === 0
    ? { sort_on: 'effective' }
    : {};
  const sort_order = data?.sort_order
    ? { sort_order: data.sort_order }
    : searchBySearchableText === 0
    ? { sort_order: 'descending' }
    : {};

  return {
    ...data,
    ...sort_on,
    ...sort_order,
    query: data?.query?.length ? data.query : defaultQuery,
  };
};

const SearchBlockView = (props) => {
  const { data, searchData, mode = 'view', variation } = props;

  const Layout = variation.view;

  const dataListingBodyVariation = getListingBodyVariation(data).id;
  const [selectedView, setSelectedView] = React.useState(
    dataListingBodyVariation,
  );

  // in the block edit you can change the used listing block variation,
  // but it's cached here in the state. So we reset it.
  React.useEffect(() => {
    if (mode !== 'view') {
      setSelectedView(dataListingBodyVariation);
    }
  }, [dataListingBodyVariation, mode]);

  const root = useSelector((state) => state.breadcrumbs.root);
  const listingBodyData = applyDefaults(searchData, root);

  const { variations } = config.blocks.blocksConfig.listing;
  const listingBodyVariation = variations.find(({ id }) => id === selectedView);

  return (
    <div className="block search">
      <Layout
        {...props}
        isEditMode={mode === 'edit'}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      >
        <ListingBody
          variation={{ ...data, ...listingBodyVariation }}
          data={listingBodyData}
          path={props.path}
          isEditMode={mode === 'edit'}
        />
      </Layout>
    </div>
  );
};

export const SearchBlockViewComponent = compose(
  withBlockExtensions,
  (Component) => React.memo(Component, blockPropsAreChanged),
)(SearchBlockView);

export default compose(withQueryString, withSearch())(SearchBlockViewComponent);
