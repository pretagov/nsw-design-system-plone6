import { UniversalLink } from '@plone/volto/components';
import PropTypes from 'prop-types';
import { isValidElement } from 'react';

ContentBlock.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  viewMoreUrl: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      'content-type': PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
    }),
  ]),
  imageIsIcon: PropTypes.bool,
  isEditMode: PropTypes.bool,
};

// TODO: Support adding alt text to images
export function ContentBlock({
  title,
  description,
  viewMoreUrl,
  links,
  image,
  imageIsIcon,
  isEditMode,
}) {
  return (
    <div className="nsw-content-block__content">
      {image ? (
        <div className="nsw-content-block__image">
          {imageIsIcon ? (
            <div className="nsw-content-block__icon">
              <img
                src={`data:${image['content-type']};base64,${image.data}`}
                alt=""
              />
            </div>
          ) : (
            <img
              src={`data:${image['content-type']};base64,${image.data}`}
              alt=""
            />
          )}
        </div>
      ) : null}
      <div className="nsw-content-block__title">{title}</div>
      <p className="nsw-content-block__copy">
        {isValidElement(description) ? (
          description
        ) : (
          <div dangerouslySetInnerHTML={{ __html: description.data }}></div>
        )}
      </p>
      {links ? (
        <ul className="nsw-content-block__list">
          {links.map(({ title, url }, index) => {
            return (
              <li key={index}>
                {isEditMode ? (
                  title
                ) : (
                  <UniversalLink href={url}>{title}</UniversalLink>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
      {viewMoreUrl ? (
        <div className="nsw-content-block__link">
          {isEditMode ? (
            'View more'
          ) : (
            <UniversalLink href={viewMoreUrl}>View more</UniversalLink>
          )}
        </div>
      ) : null}
    </div>
  );
}
