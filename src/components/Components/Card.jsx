import { FormattedDate, Icon, UniversalLink } from '@plone/volto/components';
import cx from 'classnames';
import { isValidElement } from 'react';

import EastSVG from '@material-design-icons/svg/filled/east.svg';
import NswLogo from 'nsw-design-system-plone6/assets/NSW-ONLY-nsw-government-logo.svg';

export function DefaultIcon() {
  return (
    <Icon
      name={EastSVG}
      className="default material-icons nsw-material-icons"
      size="1.875rem"
      ariaHidden={true}
    />
  );
}

export function DefaultImage({ className }) {
  return (
    <svg
      {...NswLogo.attributes}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
      dangerouslySetInnerHTML={{ __html: NswLogo.content }}
    />
  );
}

// TODO: Support adding alt text to images
export function Card({
  title,
  description,
  href,
  image,
  date,
  icon,
  urlDisplay,
  titleIsHeadline,
  imagePosition,
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
      {imagePosition !== 'hidden' ? (
        isValidElement(image) ? (
          image
        ) : (
          <div className="nsw-card__image">
            {image ? (
              <img
                src={
                  typeof image === 'string'
                    ? image
                    : `data:${image['content-type']};base64,${image.data}`
                }
                alt=""
              />
            ) : (
              <DefaultImage />
            )}
          </div>
        )
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
          {isEditMode || !href ? (
            linkTitle
          ) : (
            <UniversalLink href={href}>
              {isValidElement(title) ? (
                <div dangerouslySetInnerHTML={{ __html: title }}></div>
              ) : (
                linkTitle
              )}
            </UniversalLink>
          )}
        </div>
        {description ? (
          isValidElement(description) ? (
            <div className="nsw-card__copy">{description}</div>
          ) : (
            <div
              className="nsw-card__copy"
              dangerouslySetInnerHTML={{ __html: description.data }}
            ></div>
          )
        ) : null}

        {icon ? icon : <DefaultIcon />}
      </div>
    </div>
  );
}
