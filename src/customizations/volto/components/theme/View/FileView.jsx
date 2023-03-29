import PropTypes from 'prop-types';
import React from 'react';

import { flattenToAppURL } from '@plone/volto/helpers';

const FileView = ({ content }) => (
  <div id="file-view" className="nsw-container">
    <div className="nsw-layout">
      <div className="nsw-layout__main">
        <h1 className="documentFirstHeading">
          {content.title}
          {content.subtitle && ` - ${content.subtitle}`}
        </h1>
        {content.description && (
          <p className="nsw-intro">{content.description}</p>
        )}
        {content.file?.download && (
          <a href={flattenToAppURL(content.file.download)}>
            {content.file.filename}
          </a>
        )}
      </div>
    </div>
  </div>
);

FileView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    file: PropTypes.shape({
      download: PropTypes.string,
      filename: PropTypes.string,
    }),
  }).isRequired,
};

export default FileView;
