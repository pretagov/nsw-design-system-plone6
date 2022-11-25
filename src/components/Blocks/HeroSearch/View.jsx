import { Icon } from '@plone/volto/components';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import React from 'react';

import SearchSVG from '@material-design-icons/svg/filled/search.svg';

export function HeroSearchView({ data }) {
  console.log(data.image);
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
              <form role="search" className="hero-search__form">
                <div className="nsw-form__input-group nsw-form__input-group--icon">
                  <label className="sr-only" htmlFor="form-input-group-1">
                    {data.accessibleLabelName
                      ? data.accessibleLabelName
                      : 'Search site for:'}
                  </label>
                  <input
                    className="nsw-form__input"
                    type="text"
                    id="form-input-group-1"
                    name="form-input-group-1"
                    value=""
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
