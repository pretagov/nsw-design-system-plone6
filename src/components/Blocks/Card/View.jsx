import { ConditionalLink } from '@plone/volto/components';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import cx from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

// TODO: Support adding alt text to images
const CardView = ({ data, isEditMode }) => {
  let href = data.link?.[0]?.['@id'] || '';
  if (isInternalURL(href)) {
    href = flattenToAppURL(href);
  }
  const linkTitle = data.title || href;

  return (
    <div
      className={cx('nsw-card', {
        'nsw-card--headline': data.titleIsHeadline,
        'nsw-card--highlight': data.shouldHighlight,
        'nsw-card--light': data.colour === 'light',
        'nsw-card--dark': data.colour === 'dark',
        'nsw-card--horizontal': data.imagePosition === 'side',
      })}
    >
      {data.image ? (
        <div className="nsw-card__image">
          <img
            src={`data:${data.image['content-type']};base64,${data.image.data}`}
            // src={
            //   isInternalURL(data.image)
            //     ? flattenToAppURL(data.image)
            //     : data.image
            // }
            alt=""
          />
        </div>
      ) : null}
      <div className="nsw-card__content">
        <div className="nsw-card__title">
          {!isEditMode ? <Link to={href}>{linkTitle}</Link> : linkTitle}
        </div>
        {data.description ? (
          <div className="nsw-card__copy">{data.description}</div>
        ) : null}
        <span
          className="material-icons nsw-material-icons"
          focusable="false"
          aria-hidden="true"
        >
          east
        </span>
      </div>
    </div>
  );
};

export default CardView;
