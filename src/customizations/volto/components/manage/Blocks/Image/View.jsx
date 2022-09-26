/**
 * View image block.
 * @module components/manage/Blocks/Image/View
 */

import { UniversalLink } from '@plone/volto/components';
import {
  flattenToAppURL,
  isInternalURL,
  withBlockExtensions,
} from '@plone/volto/helpers';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * View image block class.
 * @class View
 * @extends Component
 */
export const View = ({ data, detached }) => {
  const href = data?.href?.[0]?.['@id'] || '';
  return (
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
              <img
                className={cx({
                  'full-width': data.align === 'full',
                  large: data.size === 'l',
                  medium: data.size === 'm',
                  small: data.size === 's',
                })}
                src={
                  isInternalURL(data.url)
                    ? // Backwards compat in the case that the block is storing the full server URL
                      (() => {
                        if (data.size === 'l')
                          return `${flattenToAppURL(data.url)}/@@images/image`;
                        if (data.size === 'm')
                          return `${flattenToAppURL(
                            data.url,
                          )}/@@images/image/preview`;
                        if (data.size === 's')
                          return `${flattenToAppURL(
                            data.url,
                          )}/@@images/image/mini`;
                        return `${flattenToAppURL(data.url)}/@@images/image`;
                      })()
                    : data.url
                }
                alt={data.alt || ''}
                loading="lazy"
              />
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
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withBlockExtensions(View);
