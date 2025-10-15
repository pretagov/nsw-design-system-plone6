import { forwardRef, isValidElement } from 'react';

/**
 * @typedef TabItem
 * @type {object}
 * @property {string} title - The title for the tab.
 * @property {string} urlHash - Hash used to update the URL for the currently selected tab.
 * @property {string | import("react").ReactNode} content - Content of the tab panel
 * @property {function} onClick - Add extra functionality for when the tab is clicked.
 */
/**
 * @param {Object} props
 * @param {Array.<TabItem>} props.tabItems - test
 */
export const Tabs = forwardRef(function Tabs({ tabItems }, ref) {
  return (
    <>
      <div ref={ref} className="nsw-tabs js-tabs">
        <ul className="nsw-tabs__list">
          {tabItems.map((item, index) => {
            return (
              <li key={item.title}>
                <a href={`#section${index}`} onClick={item.onClick}>
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
        {tabItems.map((item, index) => {
          return (
            <section
              key={item.title}
              id={`section${index}`}
              className="nsw-tabs__content"
            >
              {isValidElement(item.content) ? (
                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
              ) : (
                item.content
              )}
            </section>
          );
        })}
      </div>
    </>
  );
});
