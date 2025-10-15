import { isValidElement } from 'react';

/**
 * @typedef TabItem
 * @type {object}
 * @property {string} title - an ID.
 * @property {string} urlHash - your name.
 * @property {string | import("react").ReactNode} content - your age.
 */
/**
 * @param {Object} props
 * @param {Array.<TabItem>} props.tabItems - test
 */
export function Tabs({ tabItems }) {
  return (
    <>
      <div class="nsw-tabs js-tabs">
        <ul class="nsw-tabs__list">
          {tabItems.map((item, index) => {
            return (
              <li key={item.title}>
                <a href={`section${index}`}>{item.title}</a>
              </li>
            );
          })}
        </ul>
        {tabItems.map((item, index) => {
          return (
            <section key={item.title} id={`section${index}`} class="nsw-tabs__content">
              {isValidElement(item.content) ? <div dangerouslySetInnerHTML={{ __html: item.content }}></div> : item.content}
            </section>
          );
        })}
      </div>
    </>
  );
}
