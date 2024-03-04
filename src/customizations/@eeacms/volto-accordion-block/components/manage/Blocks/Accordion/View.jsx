// Removed `Icon` import
// Removed use of Semantic
// Didn't include headline support (https://github.com/eea/volto-accordion-block/commit/5e0ef4e45c7168314c7b287ece1152fa878a6f82)
// Didn't include scroll-to-heading support (https://github.com/eea/volto-accordion-block/commit/447c67ebda7b749ce74492258efa28e0ea4a1c06), but did add the `id` attribute to the title of each panel
// Didn't add support for panel linking (https://github.com/eea/volto-accordion-block/commit/76e624db2231b81e33bd7c1107792d1b10aa6ab6#diff-b4f6a9fccfef701227a0730f9d0e185fc5001392cab3b67000149f8c48202689 , https://github.com/eea/volto-accordion-block/commit/c43dd5c6340195d82694efda63fd5c7755e28e7d)
// Didn't add support for panel filtering (https://github.com/eea/volto-accordion-block/commit/902005a7c7e8ed65ec6cb7f32d45a394a474acfa#diff-b4f6a9fccfef701227a0730f9d0e185fc5001392cab3b67000149f8c48202689)

import loadable from '@loadable/component';
import { RenderBlocks } from '@plone/volto/components';
import {
  blockHasValue,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  withBlockExtensions,
} from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Copied from @eeacms/volto-accordion-block as it doesn't seem to want to be imported
const getPanels = (data) => {
  return (data?.blocks_layout?.items || []).map((id) => [
    id,
    data.blocks?.[id],
  ]);
};

// Copied from @eeacms/volto-accordion-block as it doesn't seem to want to be imported
const accordionBlockHasValue = (content) => {
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
  const blockValue = content[blocksLayoutFieldname].items.map((block) => {
    const blockData = content[blocksFieldname]?.[block];
    return blockHasValue(blockData);
  });
  if (content.hasOwnProperty('title') && content?.title.length > 0) return true;
  return blockValue.some((item) => item === true);
};

const View = (props) => {
  const { data, metadata, properties, className } = props;
  const location = useLocation();
  const panels = getPanels(data.data);
  const blockMetadata = metadata || properties;
  const accordionConfig = config.blocks.blocksConfig.accordion;

  const diffView =
    location?.pathname.slice(
      location?.pathname.lastIndexOf('/'),
      location?.pathname.length,
    ) === '/diff';

  const accordionElement = useRef(null);
  useEffect(() => {
    loadable(() => import('nsw-design-system/src/main'))
      .load()
      .then((nswDesignSystem) => {
        new nswDesignSystem['Accordion'](accordionElement.current).init();
      });
  }, [accordionElement]);

  debugger;

  return (
    <div
      className={cx(
        'accordion-block nsw-accordion js-accordion',
        className,
        data.styles ? data.styles.theme : accordionConfig?.defaults?.theme,
      )}
      {...accordionConfig.options}
      ref={accordionElement}
    >
      {panels.map(([id, panel], index) => {
        return accordionBlockHasValue(panel) ? (
          <React.Fragment key={id}>
            <div
              id={id}
              className={cx('nsw-accordion__title', {
                'nsw-accordion__open': diffView || data.collapsed === false,
              })}
            >
              {panel?.title}
            </div>
            <div className="nsw-accordion__content">
              <RenderBlocks
                {...props}
                location={location}
                metadata={blockMetadata}
                content={panel}
              />
            </div>
          </React.Fragment>
        ) : null;
      })}
    </div>
  );
};

// export default injectLazyLibs(['nswDesignSystem'])(withBlockExtensions(View));
export default withBlockExtensions(View);
