/**
 * View image block.
 * @module components/manage/Blocks/Image/View
 */

import { withBlockExtensions } from '@plone/volto/helpers';
import PropTypes from 'prop-types';
import { Body } from './Body';

/**
 * View image block class.
 * @class View
 * @extends Component
 */
export const View = ({ data }) => {
  const href = data?.href?.[0]?.['@id'] || '';
  return <Body data={data} href={href} />;
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
