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
    let resizeObserver = null
    iframe.onload = ({ target }) => {
      const iframeDocument =
        target.contentDocument || target.contentWindow.document;

      if (!iframeDocument) {
        // TODO: error handling?
        console.error("Couldn't get valid iframe document");
        return;
      }
      const iframeBody = iframeDocument.querySelector('body');

      function updateIframeHeight(contentsHeight) {
        iframe.style.minHeight = `${contentsHeight}px`;
        iframe.style['overflow-y'] = 'hidden';
        iframe.setAttribute('scrolling', 'no');
      }

      resizeObserver = new ResizeObserver((entries) => {
        requestAnimationFrame(() => {
          for (const entry of entries) {
            let elementHeight = entry.target.scrollHeight;
            const elementMargin =
              parseInt(
                iframe.contentWindow.getComputedStyle(entry.target)[
                  'margin-block'
                ],
              ) || 0;
            elementHeight += elementMargin;
            // Margin gets re-applied after a resize, causing it to keep expanding. Lets try to guard against that.
            const isExpandingFromMargin =
              elementHeight - iframe.scrollHeight === elementMargin;
            if (iframe.scrollHeight !== elementHeight && !isExpandingFromMargin) {
              updateIframeHeight(elementHeight);
            }
          }
        })
      });
      resizeObserver.observe(iframeBody);
    };
    return () => {
      if (resizeObserver?.disconnect) {
        observer.disconnect();
      }
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
