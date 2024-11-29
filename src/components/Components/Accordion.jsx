import loadable from '@loadable/component';
import cx from 'classnames';
import { Fragment, useEffect, useReducer, useRef } from 'react';

function useIsBrowser() {
  const [isHidden, enableBrowser] = useReducer(() => true, false);
  useEffect(() => {
    enableBrowser();
  }, []);
  return isHidden;
}

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.id
 * @param {boolean} props.open
 */
function AccordionHeading({ title, id, open = false }) {
  if (!title) {
    return null;
  }
  const headingId = id
    ? id
    : title
        .toLowerCase()
        .replace(/[\s-]+/g, '_')
        .replace(/[^\w]+/g, '');

  return (
    <div
      id={headingId}
      className={cx('nsw-accordion__title', {
        'nsw-accordion__open': open,
      })}
    >
      {title}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {ReactNode} props.children
 */
function AccordionContent({ children }) {
  return <div className="nsw-accordion__content">{children}</div>;
}

/**
 *
 * @param {Object} props - List of items
 * @param {Object[]} props.items - List of items
 * @param {string} props.items[].title - The text to go in the heading of the accordion
 * @param {string} props.items[].id - The text to go in the heading of the accordion
 * @param {boolean} props.items[].open
 * @param {React.ReactNode} props.items[].Content - The body of an accordion.
 */
export function Accordion({ items }) {
  const isBrowser = useIsBrowser();

  const accordionElement = useRef(null);
  useEffect(() => {
    if (!accordionElement.current) {
      return;
    }
    if (!isBrowser) {
      return;
    }
    loadable(() => import('nsw-design-system/src/main'))
      .load()
      .then((nswDesignSystem) => {
        // Same guard clause here to guard against the closure within this async code.
        if (!accordionElement.current) {
          return;
        }
        new nswDesignSystem['Accordion'](accordionElement.current).init();
      });
  }, [isBrowser]);

  return (
    <div
      className={cx('nsw-accordion', {
        'js-accordion': isBrowser,
      })}
      ref={accordionElement}
    >
      {items.map((item, index) => {
        if (!item.Content) {
          return null;
        }
        return (
          <Fragment key={index}>
            <AccordionHeading
              title={item.title}
              id={item.id}
              open={item.open}
            />
            <AccordionContent>{item.Content}</AccordionContent>
          </Fragment>
        );
      })}
    </div>
  );
}
