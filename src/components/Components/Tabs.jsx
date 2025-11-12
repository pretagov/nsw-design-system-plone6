import { forwardRef } from 'react';

/**
 * @typedef TabItem
 * @type {object}
 * @property {string} title - The title for the tab.
 * @property {string} urlHash - Hash used to update the URL for the currently selected tab.
 * @property {string | import("react").ReactNode} content - Content of the tab panel.
 */
/**
 * @param {Object} props
 * @param {Array.<TabItem>} props.tabItems - test
 */
export const Tabs = forwardRef(function Tabs({ tabItems, title }, ref) {
  return (
    <>
      <div ref={ref} className="nsw-tabs js-tabs">
        <ul className="nsw-tabs__list" aria-label={title}>
          {tabItems.map((item, index) => {
            const Element = item.as || 'a';
            return (
              <li key={item.title}>
                <Element href={`#tab-${item.urlHash}`}>{item.title}</Element>
              </li>
            );
          })}
        </ul>
        {tabItems.map((item, index) => {
          return (
            <section
              key={item.title}
              id={`tab-${item.urlHash}`}
              className="nsw-tabs__content"
            >
              {item.content}
            </section>
          );
        })}
      </div>
    </>
  );
});
