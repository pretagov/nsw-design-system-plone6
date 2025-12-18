/**
 * Image block body (not a shadow).
 * @module components/manage/Blocks/Image/Body
 */

import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
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

  if (!baseImageString) {
    return null;
  }

  const imageString = withImageScale(baseImageString, data.size);

  return (
    <Media {...data} src={imageString} title={data.alt} href={href} />
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
