/**
 * Image view component.
 * @module components/theme/View/ImageView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import prettybytes from 'pretty-bytes';

import { flattenToAppURL } from '@plone/volto/helpers';

/**
 * Image view component class.
 * @function ImageView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */
const ImageView = ({ content }) => (
  <div id="file-view" className="view-wrapper nsw-container">
    <div className="nsw-layout">
      <div className="nsw-layout__main">
        <h1>
          {content.title}
          {content.subtitle && ` - ${content.subtitle}`}
        </h1>
        {content.description && (
          <p className="nsw-intro">{content.description}</p>
        )}
        {content?.image?.download && (
          <a href={flattenToAppURL(content.image.download)}>
            <img
              alt={content.title}
              src={flattenToAppURL(content.image.scales.preview.download)}
            />
            <figcaption>
              <FormattedMessage
                id="Size: {size}"
                defaultMessage="Size: {size}"
                values={{ size: prettybytes(content.image.size) }}
              />
              &nbsp; &mdash; &nbsp;
              <FormattedMessage
                id="Click to download full sized image"
                defaultMessage="Click to download full sized image"
              />
            </figcaption>
          </a>
        )}
      </div>
    </div>
  </div>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ImageView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.shape({
      scales: PropTypes.shape({
        preview: PropTypes.shape({
          download: PropTypes.string,
        }),
      }),
    }),
  }).isRequired,
};

export default ImageView;
