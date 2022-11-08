import { Pagination } from '@plone/volto/components';
import withQuerystringResults from '@plone/volto/components/manage/Blocks/Listing/withQuerystringResults';
import config from '@plone/volto/registry';
import React, { createRef } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dimmer, Loader } from 'semantic-ui-react';

const ListingBody = withQuerystringResults((props) => {
  const {
    data = {},
    isEditMode,
    listingItems,
    totalPages,
    onPaginationChange,
    variation,
    currentPage,
    prevBatch,
    nextBatch,
    isFolderContentsListing,
    hasLoaded,
  } = props;

  let ListingBodyTemplate;
  // Legacy support if template is present
  const variations = config.blocks?.blocksConfig['listing']?.variations || [];
  const defaultVariation = variations.filter((item) => item.isDefault)?.[0];

  if (data.template && !data.variation) {
    const legacyTemplateConfig = variations.find(
      (item) => item.id === data.template,
    );
    ListingBodyTemplate = legacyTemplateConfig.template;
  } else {
    ListingBodyTemplate =
      variation?.template ?? defaultVariation?.template ?? null;
  }

  const listingRef = createRef();

  return listingItems?.length > 0 ? (
    <div ref={listingRef}>
      <ListingBodyTemplate
        items={listingItems}
        isEditMode={isEditMode}
        {...data}
        {...variation}
      />
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <Pagination
            current={currentPage}
            total={totalPages}
            onChangePage={(e, { activePage }) => {
              !isEditMode &&
                listingRef.current.scrollIntoView({ behavior: 'smooth' });
              onPaginationChange(e, { activePage });
            }}
          />
        </div>
      )}
    </div>
  ) : isEditMode ? (
    <div className="listing message" ref={listingRef}>
      {isFolderContentsListing && (
        <FormattedMessage
          id="No items found in this container."
          defaultMessage="No items found in this container."
        />
      )}
      {hasLoaded && (
        <FormattedMessage
          id="No results found."
          defaultMessage="No results found."
        />
      )}
      <Dimmer active={!hasLoaded} inverted>
        <Loader indeterminate size="small">
          <FormattedMessage id="loading" defaultMessage="Loading" />
        </Loader>
      </Dimmer>
    </div>
  ) : (
    <div>
      {hasLoaded && (
        <FormattedMessage
          id="No results found."
          defaultMessage="No results found."
        />
      )}
      <Dimmer active={!hasLoaded} inverted>
        <Loader indeterminate size="small">
          <FormattedMessage id="loading" defaultMessage="Loading" />
        </Loader>
      </Dimmer>
    </div>
  );
});

export default injectIntl(ListingBody);
