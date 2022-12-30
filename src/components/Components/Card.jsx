import { FormattedDate, Icon } from '@plone/volto/components';
import cx from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import EastSVG from '@material-design-icons/svg/filled/east.svg';

// TODO: Support adding alt text to images
export function Card({
  title,
  titleIsHeadline,
  description,
  href,
  image,
  imagePosition,
  date,
  urlDisplay,
  colour,
  shouldHighlight,
  isEditMode,
}) {
  const linkTitle = title || href;
  const cleanDate = date === 'None' ? null : date;

  return (
    <div
      className={cx('nsw-card', {
        'nsw-card--headline': titleIsHeadline,
        'nsw-card--highlight': shouldHighlight,
        'nsw-card--light': colour === 'light',
        'nsw-card--dark': colour === 'dark',
        'nsw-card--horizontal': imagePosition === 'side',
      })}
    >
      {image ? (
        <div className="nsw-card__image">
          <img
            src={
              typeof image === 'string'
                ? image
                : `data:${image['content-type']};base64,${image.data}`
            }
            alt=""
          />
        </div>
      ) : null}
      <div className="nsw-card__content">
        {cleanDate || urlDisplay ? (
          <div className="nsw-card__date">
            {cleanDate ? (
              <FormattedDate date={cleanDate} locale="en-au" />
            ) : null}
            {urlDisplay ? (
              <p style={{ marginBlockEnd: '0' }}>{urlDisplay}</p>
            ) : null}
          </div>
        ) : null}
        <div className="nsw-card__title">
          {!isEditMode ? <Link to={href}>{linkTitle}</Link> : linkTitle}
        </div>
        {description ? (
          <div className="nsw-card__copy">{description}</div>
        ) : null}

        <Icon
          name={EastSVG}
          className="material-icons nsw-material-icons"
          size="1.875rem"
          ariaHidden={true}
        />
        {/* <span
          className="material-icons nsw-material-icons"
          focusable="false"
          aria-hidden="true"
        >
          east
        </span> */}
      </div>
    </div>
  );
}
