import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  noSelection: {
    id: 'Relevance',
    defaultMessage: 'Relevance',
  },
  sortBy: {
    id: 'Sort by',
    defaultMessage: 'Sort by',
  },
});

const sortOptions = {
  Relevance: {
    sort_on: '',
    sort_order: '',
  },
  'Most recent': {
    sort_on: 'created',
    sort_order: 'descending',
  },
  'A-Z': {
    sort_on: 'sortable_title',
    sort_order: 'ascending',
  },
};

const SortOn = (props) => {
  const {
    data = {},
    sortOn = null,
    isEditMode,
    querystring = {},
    updateSort,
  } = props;
  const intl = useIntl();

  const activeSortOn = sortOn || data?.query?.sort_on || '';
  const value =
    Object.keys(sortOptions)[
      Object.values(sortOptions).findIndex(
        (option) => option.sort_on === activeSortOn,
      )
    ] || intl.formatMessage(messages.noSelection);

  return (
    <div className="nsw-results-bar__sorting">
      <label className="nsw-form__label" htmlFor="results-sort">
        {data.sortOnLabel || intl.formatMessage(messages.sortBy)}
      </label>
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <select
        disabled={isEditMode}
        className="nsw-form__select"
        id="results-sort"
        name="results-sort"
        value={value}
        onChange={({ target }) => {
          if (isEditMode) {
            return;
          }
          updateSort({
            sortOn: sortOptions[target.value].sort_on,
            sortOrder: sortOptions[target.value].sort_order,
          });
        }}
      >
        {Object.keys(sortOptions).map((sortOption) => {
          return (
            <option key={sortOption} value={sortOption}>
              {sortOption}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SortOn;
