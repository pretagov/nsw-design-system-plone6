import { UniversalLink } from '@plone/volto/components';
import PropTypes from 'prop-types';
import { isValidElement } from 'react';

// TODO: Keeping this in card isn't great
import { DefaultImage } from 'nsw-design-system-plone6/components/Components/Card';

ContentBlock.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.shape({
      'content-type': PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
      encoding: PropTypes.string.isRequired,
    }),
  ]),
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
  imagePosition,
  isEditMode,
}) {
  return (
    <div className="nsw-content-block__content">
      {imagePosition !== 'hidden' ? (
        image ? (
          isValidElement(image) ? (
            image
          ) : (
            <div className="nsw-content-block__image">
              {imageIsIcon ? (
                <div className="nsw-content-block__icon">
                  <img
                    src={
                      typeof image === 'string'
                        ? image
                        : `data:${image['content-type']};base64,${image.data}`
                    }
                    alt=""
                  />
                </div>
              ) : (
                <img
                  className="nsw-content-block__image"
                  src={
                    typeof image === 'string'
                      ? image
                      : `data:${image['content-type']};base64,${image.data}`
                  }
                  alt=""
                />
              )}
            </div>
          )
        ) : (
          <DefaultImage className="nsw-content-block__image" />
        )
      ) : null}
      <div className="nsw-content-block__title">{title}</div>
      <div className="nsw-content-block__copy">
        {isValidElement(description) ? (
          description
        ) : (
          <div dangerouslySetInnerHTML={{ __html: description?.data }}></div>
        )}
      </div>
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
        isValidElement(viewMoreUrl) ? (
          viewMoreUrl
        ) : (
          <div className="nsw-content-block__link">
            {isEditMode ? (
              'View more'
            ) : (
              <UniversalLink href={viewMoreUrl}>View more</UniversalLink>
            )}
          </div>
        )
      ) : null}
    </div>
  );
}
