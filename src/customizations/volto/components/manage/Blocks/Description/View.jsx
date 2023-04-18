/**
 * View title/description block.
 * @module volto-slate/blocks/Title/TitleBlockView
 *
 * Changed `documentDescription` class to `nsw-intro`
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * View title block component.
 * @class View
 * @extends Component
 */
const TitleBlockView = ({ properties, metadata }) => {
  return (
    <p className="nsw-intro">{(metadata || properties)['description'] || ''}</p>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
TitleBlockView.propTypes = {
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
  metadata: PropTypes.objectOf(PropTypes.any),
};

export default TitleBlockView;
