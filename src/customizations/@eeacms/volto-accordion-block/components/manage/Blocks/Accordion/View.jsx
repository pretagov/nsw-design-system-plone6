import loadable from '@loadable/component';
import { RenderBlocks } from '@plone/volto/components';
import {
  blockHasValue,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  withBlockExtensions,
} from '@plone/volto/helpers';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import React, { useEffect, useRef } from 'react';

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
  const { data, metadata, properties } = props;
  const panels = getPanels(data.data);
  const blockMetadata = metadata || properties;

  const accordionElement = useRef(null);
  useEffect(() => {
    loadable(() => import('nsw-design-system/src/main'))
      .load()
      .then((nswDesignSystem) => {
        new nswDesignSystem['Accordion'](accordionElement.current).init();
      });
  }, [accordionElement]);

  return (
    <div
      className="accordion-block nsw-accordion js-accordion"
      ref={accordionElement}
    >
      {panels.map(([id, panel], index) => {
        return accordionBlockHasValue(panel) ? (
          <React.Fragment key={id}>
            <div className="nsw-accordion__title">{panel?.title}</div>
            <div className="nsw-accordion__content">
              <RenderBlocks
                {...props}
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
