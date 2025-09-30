import { UniversalLink } from '@plone/volto/components';
import config from '@plone/volto/registry';
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
  viewMoreUrl: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.object,
  ]),
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.shape({
      'content-type': PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
    }),
  ]),
  imagePosition: PropTypes.oneOf(['hidden', 'above']),
  imageIsIcon: PropTypes.bool,
  showViewMoreLink: PropTypes.bool,
  isEditMode: PropTypes.bool,
  columns: PropTypes.number,
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
  showViewMoreLink,
  isEditMode,
  data,
  columns,
}) {
  const columnsImageSizeMapping =
    config.blocks.blocksConfig[data['@type']]?.columnsImageSizeMapping;

  let imageString = undefined;
  if (image) {
    imageString =
      typeof image === 'string'
        ? columns && columnsImageSizeMapping
          ? `${image}/${columnsImageSizeMapping[columns]}`
          : image
        : `data:${image['content-type']};base64,${image.data}`;
  }

  const viewMoreUniversalLinkAttributes =
    typeof href === 'string' ? { href: viewMoreUrl } : { item: viewMoreUrl };

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
                  <img src={imageString} alt="" />
                </div>
              ) : (
                <img src={imageString} alt="" />
              )}
            </div>
          )
        ) : imageIsIcon ? (
          <div className="nsw-content-block__icon">
            <DefaultImage className="nsw-content-block__image" />
          </div>
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
            const universalLinkAttributes =
              typeof href === 'string' ? { href: url } : { item: url };
            return (
              <li key={index}>
                {isEditMode ? (
                  title
                ) : (
                  <UniversalLink {...universalLinkAttributes}>
                    {title}
                  </UniversalLink>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
      {/* Explicit check for false here to maintain backwards compatibility from before this field existed */}
      {viewMoreUrl && showViewMoreLink !== false ? (
        isValidElement(viewMoreUrl) ? (
          viewMoreUrl
        ) : (
          <div className="nsw-content-block__link">
            {isEditMode ? (
              'View more'
            ) : (
              <UniversalLink {...viewMoreUniversalLinkAttributes}>
                View more
              </UniversalLink>
            )}
          </div>
        )
      ) : null}
    </div>
  );
}
