/**
 * Image block body (not a shadow).
 * @module components/manage/Blocks/Image/Body
 */

import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { Media } from 'nsw-design-system-plone6/components/Components/Media';

/**
 * View image block class.
 * @class View
 * @extends Component
 */
export const Body = ({ data, href }) => {
  const columnsImageSizeMapping =
    config.blocks.blocksConfig[data['@type']].columnsImageSizeMapping;

  function withImageScale(url, size) {
    // Resort to full width if not set
    const sizeToUse = size ? size : 'fullWidth';
    // Fallback for missing mapping
    const scaleSize = columnsImageSizeMapping?.[sizeToUse] || 'great';
    return `${url}/${scaleSize}`;
  }

  const baseImageString = isInternalURL(data.url)
    ? // Backwards compat in the case that the block is storing the full server URL
      (() => {
        if (data.size === 'l')
          return `${flattenToAppURL(data.url)}/@@images/image`;
        if (data.size === 'm')
          return `${flattenToAppURL(data.url)}/@@images/image/preview`;
        if (data.size === 's')
          return `${flattenToAppURL(data.url)}/@@images/image/mini`;
        return `${flattenToAppURL(data.url)}/@@images/image`;
      })()
    : flattenToAppURL(data.url);

  const imageString = withImageScale(baseImageString, data.size);

  return (
    <>
      <figure
        className={cx('nsw-media', {
          [`nsw-media--${data.captionBackgroundColour}`]: !!data.captionBackgroundColour,
          [`nsw-media--${data.size}`]:
            !!data.size &&
            !['left', 'right'].includes(data.align) &&
            data.size !== 'fullWidth',
          [`nsw-media--${data.align}-${data.size}`]:
            !!data.size && !!data.align && data.size !== 'fullWidth',
        })}
      >
        {data.url && (
          <>
            {(() => {
              const image = (
                <picture>
                  {/* Up until the `medium` breakpoint, the image is full width so needs */}
                  <source
                    srcSet={`${baseImageString}/large`}
                    media="(max-width: 768)" // Can't use media queries here. 768 is $nsw-breakpoints.md in SCSS
                  />
                  <img
                    className={cx({
                      'full-width': data.align === 'full',
                      large: data.size === 'l',
                      medium: data.size === 'm',
                      small: data.size === 's',
                    })}
                    src={imageString}
                    alt={data.alt || ''}
                    loading="lazy"
                  />
                </picture>
              );
              if (href) {
                return (
                  <UniversalLink
                    href={href}
                    openLinkInNewTab={data.openLinkInNewTab}
                  >
                    {image}
                  </UniversalLink>
                );
              } else {
                return image;
              }
            })()}
          </>
        )}
        {data.caption ? <figcaption>{data.caption}</figcaption> : null}
      </figure>
      <Media {...data} src={imageString} title={data.alt} />
    </>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Body.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  href: PropTypes.string,
};
