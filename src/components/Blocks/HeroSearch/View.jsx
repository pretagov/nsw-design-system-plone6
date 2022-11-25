import React from 'react';

import { Icon } from '@plone/volto/components';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import { useHistory } from 'react-router-dom';

import SearchSVG from '@material-design-icons/svg/filled/search.svg';

export function HeroSearchView({ data, id: blockId }) {
  const history = useHistory();
  const inputId = `${blockId}-heroSearchInput`;

  function onSubmit(event) {
    const formData = new FormData(event.target);
    // TODO: Add path to scope the search if required
    history.push(
      `/search?SearchableText=${encodeURIComponent(
        formData.get(inputId),
      )}&path=/)}`,
    );
    event.preventDefault();
  }

  return (
    <div
      className="nsw-section nsw-section--image"
      style={{
        backgroundImage: data.image
          ? `url(data:${data.image['content-type']};base64,${data.image.data})`
          : null,
      }}
    >
      <div className="hero-search">
        <div className="nsw-container">
          <div className="hero-search__wrapper">
            <div className="hero-search__content">
              {data.title ? <h1>{data.title}</h1> : null}
              <p className="nsw-intro">
                {data.description ? data.description : null}
              </p>
              <form
                role="search"
                onSubmit={onSubmit}
                className="hero-search__form"
              >
                <div className="nsw-form__input-group nsw-form__input-group--icon">
                  <label className="sr-only" htmlFor={inputId}>
                    {data.accessibleLabelName
                      ? data.accessibleLabelName
                      : 'Search site for:'}
                  </label>
                  <input
                    className="nsw-form__input"
                    type="text"
                    id={inputId}
                    name={inputId}
                    placeholder={
                      data.inputPlaceholderText
                        ? data.inputPlaceholderText
                        : null
                    }
                  />
                  <button
                    className="nsw-button nsw-button--dark nsw-button--flex"
                    type="submit"
                  >
                    {/* TODO: i18n Hero search button */}
                    <span className="sr-only">Search</span>
                    <Icon
                      name={SearchSVG}
                      className="material-icons nsw-material-icons"
                      style={{}}
                      size="36px"
                      ariaHidden={true}
                    />
                  </button>
                </div>
              </form>
              {data.suggestedLinks ? (
                <div className="hero-search__suggested">
                  <ul>
                    {data.suggestedLinks.map((suggestedLink) => {
                      if (
                        !suggestedLink.link ||
                        !suggestedLink.link[0] ||
                        !suggestedLink.link[0]['@id']
                      ) {
                        return null;
                      }
                      let href = suggestedLink.link[0]['@id'];
                      if (isInternalURL(href)) {
                        href = flattenToAppURL(href);
                      }
                      return (
                        <li>
                          <a href={href}>{suggestedLink.title}</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
