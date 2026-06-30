/**
 * View html block.
 * @module components/manage/Blocks/HTML/View
 */

import PropTypes from 'prop-types';
import React from 'react';

/**
 * Neutralise <img> tags whose src points at an empty image scale, e.g.
 * `.../aocemail.png/@@images/` (nothing after `@@images/`). These come from
 * raw HTML that was pasted with a truncated image src. The browser would
 * request the empty-scale URL, the backend returns 400, and it surfaces as an
 * unhandled "Bad Request" in Sentry. Stripping the src here stops the request
 * without otherwise touching the markup.
 */
function stripEmptyImageScales(html) {
  if (!html) {
    return html;
  }
  return html.replace(
    /(<img\b[^>]*?\bsrc=)(["'])([^"']*\/@@images\/+)\2/gi,
    (match, prefix, quote, src) =>
      // Only rewrite when there is no scale after `@@images/`.
      src.replace(/\/+$/, '').endsWith('/@@images') ? `${prefix}${quote}${quote}` : match,
  );
}

/**
 * View html block class.
 * @class View
 * @extends Component
 */
const View = ({ data }) => {
  const blockWrapperRef = React.useRef();
  const html = React.useMemo(() => stripEmptyImageScales(data.html), [
    data.html,
  ]);

  React.useEffect(() => {
    /** @type {HTMLElement} */
    const element = blockWrapperRef.current;
    const iframes = element.querySelectorAll('iframe');
    if (iframes.length < 1) {
      return;
    }
    // TODO: Handle multiple iframes (unlikely but you never know)
    const iframe = iframes[0];
    let resizeObserver = null;
    iframe.onload = ({ target }) => {
      let iframeDocument = null;
      try {
        iframeDocument =
          target.contentDocument || target.contentWindow.document;
      } catch (error) {
        // iframe source is cross-origin so the resizeobserver code won't work.
        if (error.name === 'SecurityError') {
          return;
        } else {
          throw error;
        }
      }

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
            if (
              iframe.scrollHeight !== elementHeight &&
              !isExpandingFromMargin
            ) {
              updateIframeHeight(elementHeight);
            }
          }
        });
      });
      resizeObserver.observe(iframeBody);
    };
    return () => {
      if (resizeObserver?.disconnect) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={blockWrapperRef}
      className="block html"
      dangerouslySetInnerHTML={{ __html: html }}
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
