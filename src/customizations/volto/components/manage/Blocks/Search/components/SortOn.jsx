import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  noSelection: {
    id: 'No selection',
    defaultMessage: 'No selection',
  },
  sortBy: {
    id: 'Sort by',
    defaultMessage: 'Sort by',
  },
});

const SortOn = (props) => {
  const { data = {}, sortOn = null, isEditMode, querystring = {} } = props;
  const { sortable_indexes } = querystring;

  const intl = useIntl();

  const activeSortOn = sortOn || data?.query?.sort_on || '';

  const { sortOnOptions = [] } = data;
  const value = activeSortOn || intl.formatMessage(messages.noSelection);
  const label =
    activeSortOn && sortable_indexes
      ? sortable_indexes[activeSortOn]?.title
      : activeSortOn || intl.formatMessage(messages.noSelection);

  return (
    <div className="nsw-results-bar__sorting">
      <label className="nsw-form__label" for="results-sort">
        {label}
        {/* {intl.formatMessage(messages.sortBy)} */}
      </label>
      <select
        disabled={isEditMode}
        className="nsw-form__select"
        id="results-sort"
        name="results-sort"
        value={value}
      >
        {sortOnOptions.map((sortKey) => {
          const label = sortable_indexes[sortKey]?.title || sortKey;
          return (
            <option key={sortKey} value={sortKey}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SortOn;
