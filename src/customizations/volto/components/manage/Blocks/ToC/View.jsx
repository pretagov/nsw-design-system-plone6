import { filter, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { defineMessages, injectIntl } from 'react-intl';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';

const messages = defineMessages({
  onThisPage: {
    id: 'On this page',
    defaultMessage: 'On this page',
  },
});

const View = ({ properties, data, intl }) => {
  const blocksFieldname = getBlocksFieldname(properties);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);

  return (
    <div className="block table-of-contents">
      <nav className="nsw-in-page-nav" aria-labelledby="in-page-nav">
        <div id="in-page-nav" className="nsw-in-page-nav__title">
          {intl.formatMessage(messages.onThisPage)}
        </div>
        <ul>
          {map(
            filter(
              map(
                properties[blocksLayoutFieldname].items,
                (id) => properties[blocksFieldname][id],
              ),
              (block) =>
                block['@type'] === 'text' &&
                block.text?.blocks[0].type.indexOf('header-') === 0,
            ),
            (block) => (
              <li
                key={block.text.blocks[0].key}
                className={block.text.blocks[0].type}
              >
                <AnchorLink href={`#${block.text.blocks[0].key}`}>
                  {block.text.blocks[0].text}
                </AnchorLink>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
};

View.propTypes = {
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default React.memo(injectIntl(View));
