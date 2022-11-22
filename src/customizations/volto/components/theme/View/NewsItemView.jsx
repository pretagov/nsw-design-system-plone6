/**
 * NewsItemView view component.
 * @module components/theme/View/NewsItemView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import {
  hasBlocksData,
  flattenToAppURL,
  flattenHTMLToAppURL,
} from '@plone/volto/helpers';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';

/**
 * NewsItemView view component class.
 * @function NewsItemView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */
const NewsItemView = ({ content }) => {
  return (
    <div id="page-document" className="view-wrapper event-view nsw-container">
      <div className="nsw-layout">
        <div className="nsw-layout__main">
          {hasBlocksData(content) ? (
            <RenderBlocks content={content} />
          ) : (
            <>
              {content.title && (
                <h1 className="documentFirstHeading">
                  {content.title}
                  {content.subtitle && ` - ${content.subtitle}`}
                </h1>
              )}
              {content.description && (
                <p className="documentDescription">{content.description}</p>
              )}
              {content.image && (
                <Image
                  className="documentImage"
                  alt={content.title}
                  title={content.title}
                  src={
                    content.image['content-type'] === 'image/svg+xml'
                      ? flattenToAppURL(content.image.download)
                      : flattenToAppURL(content.image.scales.mini.download)
                  }
                  floated="right"
                />
              )}
              {content.text && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: flattenHTMLToAppURL(content.text.data),
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
NewsItemView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    text: PropTypes.shape({
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default NewsItemView;
