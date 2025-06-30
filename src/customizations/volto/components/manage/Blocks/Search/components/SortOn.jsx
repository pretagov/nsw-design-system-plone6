import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  unsorted: {
    id: 'Unsorted',
    defaultMessage: 'Unsorted',
  },
  relevance: {
    id: 'Relevance',
    defaultMessage: 'Relevance',
  },
  sortBy: {
    id: 'Sort by',
    defaultMessage: 'Sort by',
  },
});

const SortOn = (props) => {
  const {
    data = {},
    sortOn = null,
    isEditMode,
    querystring = {},
    searchedText,
    setSortOn,
  } = props;
  const intl = useIntl();

  const { sortOnOptions = [] } = data;
  // We don't want to show sorting options if there is only 1 way to sort
  if (!sortOnOptions || sortOnOptions.length < 1) {
    return null;
  }

  const { sortable_indexes } = querystring;

  const activeSortOn = sortOn ?? data?.query?.sort_on ?? '';

  const noValueLabel = intl.formatMessage(messages.relevance);

  const options = [
    { value: '', label: noValueLabel, disabled: !searchedText },
    ...sortOnOptions.map((k) => ({
      value: k,
      label: k === '' ? noValueLabel : sortable_indexes[k]?.title || k,
    })),
  ];

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
        value={activeSortOn}
        onChange={({ target }) => {
          !isEditMode && setSortOn(target.value);
        }}
      >
        {options.map((option) => {
          return (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SortOn;
