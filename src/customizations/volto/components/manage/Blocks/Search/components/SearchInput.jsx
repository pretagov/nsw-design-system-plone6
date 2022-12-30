import { Icon } from '@plone/volto/components';
import { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router';

import SearchSVG from '@material-design-icons/svg/filled/search.svg';

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
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const urlSearchedText = searchParams.get('SearchableText');

  useEffect(() => {
    if (!urlSearchedText) {
      return;
    }
    setSearchText(urlSearchedText);
    onTriggerSearch(urlSearchedText);
  }, [setSearchText, onTriggerSearch, urlSearchedText]);

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
            <Icon
              name={SearchSVG}
              className="material-icons nsw-material-icons"
              size="36px"
              ariaHidden={true}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
