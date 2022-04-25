import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
});

const SearchInput = ({
  data,
  searchText,
  setSearchText,
  isLive,
  onTriggerSearch,
  id: blockId,
}) => {
  const intl = useIntl();
  const inputHtmlId = `${blockId}-searchtext`;

  return (
    <div className="search-input">
      <div className="nsw-form__group">
        <div className="nsw-form__input-group nsw-form__input-group--icon nsw-form__input-group--large">
          <label className="sr-only" htmlFor={inputHtmlId}>
            Search
          </label>
          <input
            className="nsw-form__input"
            type="text"
            id={inputHtmlId}
            name="search"
            value={searchText}
            placeholder={
              data.searchInputPrompt || intl.formatMessage(messages.search)
            }
            onKeyPress={(event) => {
              if (isLive || event.key === 'Enter') {
                onTriggerSearch(searchText);
              }
            }}
            onChange={(event) => {
              const value = event.target.value;
              setSearchText(value);
              if (isLive) {
                onTriggerSearch(value);
              }
            }}
          />
          <button
            className="nsw-button nsw-button--white nsw-button--flex"
            type="submit"
          >
            <span
              className="material-icons nsw-material-icons"
              focusable="false"
              aria-hidden="true"
            >
              search
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
