import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

const messages = defineMessages({
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  closeSearch: {
    id: 'Close search',
    defaultMessage: 'Close search',
  },
  searchSite: {
    id: 'Search Site',
    defaultMessage: 'Search Site',
  },
});

const SearchWidget = () => {
  const intl = useIntl();
  const [text, setText] = useState('');
  const { pathname } = useLocation();
  const history = useHistory();

  function onChangeText(event) {
    setText(event.target.value);
  }

  function onSubmit(event) {
    const path =
      pathname?.length > 0 ? `&path=${encodeURIComponent(pathname)}` : '';
    history.push(`/search?SearchableText=${encodeURIComponent(text)}${path}`);
    event.preventDefault();
  }

  return (
    <div
      className="nsw-header__search-area js-search-area"
      id="header-search"
      hidden
    >
      <form role="search" action="/search" onSubmit={onSubmit}>
        <label htmlFor="nsw-header-input" className="sr-only">
          Search site for:
        </label>
        <input
          className="nsw-header__input js-search-input"
          type="text"
          autoComplete="off"
          id="nsw-header-input"
          name="SearchableText"
          value={text}
          onChange={onChangeText}
          //   aria-label={intl.formatMessage(messages.search)}
          //   placeholder={intl.formatMessage(messages.searchSite)}
        />
        <button className="nsw-icon-button nsw-icon-button--flex" type="submit">
          <span
            className="material-icons nsw-material-icons"
            focusable="false"
            aria-hidden="true"
          >
            {/* This text is used to set the material icon, doesn't need i18n */}
            search
          </span>
          <span className="sr-only">{intl.formatMessage(messages.search)}</span>
        </button>
      </form>
      <button
        className="nsw-icon-button js-close-search"
        aria-expanded="true"
        aria-controls="header-search"
      >
        <span
          className="material-icons nsw-material-icons"
          focusable="false"
          aria-hidden="true"
        >
          {/* This text is used to set the material icon, doesn't need i18n */}
          close
        </span>
        <span className="sr-only">
          {intl.formatMessage(messages.closeSearch)}
        </span>
      </button>
    </div>
  );
};

export default SearchWidget;
