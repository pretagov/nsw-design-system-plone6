/**
 * View html block.
 * @module components/manage/Blocks/HTML/View
 */

import PropTypes from 'prop-types';
import React from 'react';

/**
 * View html block class.
 * @class View
 * @extends Component
 */
const View = ({ data }) => {
  const blockWrapperRef = React.useRef();

  React.useEffect(() => {
    /** @type {HTMLElement} */
    const element = blockWrapperRef.current;
    const iframes = element.querySelectorAll('iframe');
    if (iframes.length < 1) {
      return;
    }
    // TODO: Handle multiple iframes (unlikely but you never know)
    const iframe = iframes[0];
    iframe.onload = ({ target }) => {
      const iframeDocument =
        target.contentDocument || target.contentWindow.document;

      if (!iframeDocument) {
        // TODO: error handling?
        console.error("Couldn't get valid iframe document");
        return;
      }

      const iframeBody = iframeDocument.querySelector('body');
      const contentsHeight = iframeBody.scrollHeight;
      iframe.setAttribute('style', `min-height: ${contentsHeight}px`);
    };
  }, []);

  return (
    <div
      ref={blockWrapperRef}
      className="block html"
      dangerouslySetInnerHTML={{ __html: data.html }}
    />
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

export default View;
