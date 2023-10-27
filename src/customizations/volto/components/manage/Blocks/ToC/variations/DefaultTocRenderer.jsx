/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import PropTypes from 'prop-types';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  onThisPage: {
    id: 'On this page',
    defaultMessage: 'On this page',
  },
});

const RenderListItems = ({ items, data }) => {
  return items.map((item) => {
    const { id, level, title } = item;
    return (
      item && (
        <>
          <li key={id} className={`item headline-${level}`}>
            <AnchorLink href={`#${id}`}>{title}</AnchorLink>
          </li>
          {/* NSW In-page navigation doesn't supported nested lists out-the-box (https://digitalnsw.github.io/nsw-design-system/components/in-page-nav/index.html) */}
          {item.items?.length > 0 ? (
            <RenderListItems items={item.items} data={data} />
          ) : null}
        </>
      )
    );
  });
};

/**
 * View toc block class.
 * @class View
 * @extends Component
 */
const View = ({ data, tocEntries, intl }) => {
  return (
    <nav className="nsw-in-page-nav" aria-labelledby="in-page-nav">
      <div id="in-page-nav" className="nsw-in-page-nav__title">
        {intl.formatMessage(messages.onThisPage)}
      </div>
      <ul>
        <RenderListItems items={tocEntries} data={data} />
      </ul>
    </nav>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(View);
