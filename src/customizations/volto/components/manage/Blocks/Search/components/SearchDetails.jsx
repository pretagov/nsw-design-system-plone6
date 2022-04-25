import { withQueryString } from '@plone/volto/components/manage/Blocks/Search/hocs';
import { usePagination } from '@plone/volto/helpers';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

// TODO: This is a massive hack and doesn't work with the pagination. Need to find
//   how to handle pagination/ batching through redux.
const SearchDetails = ({ total, batchSize }) => {
  const qs = useSelector((state) => state.querystring);
  const { currentPage } = usePagination(qs, 1);
  const resultsStart = (currentPage - 1) * batchSize + 1;
  const resultsEnd = Math.min(currentPage * batchSize, total);

  return (
    <div className="nsw-results-bar__info">
      <FormattedMessage
        id="Showing results {resultsStart} - {resultsEnd} of {resultsTotal} results"
        defaultMessage="Showing results {resultsStart} - {resultsEnd} of {resultsTotal} results"
        values={{
          resultsStart: resultsStart,
          resultsEnd: resultsEnd,
          resultsTotal: total,
        }}
      />
    </div>
  );
};

export default withQueryString(SearchDetails);
