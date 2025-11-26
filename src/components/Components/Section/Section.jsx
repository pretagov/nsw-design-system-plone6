import { getBaseUrl, flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';
import { getSectionColour } from 'nsw-design-system-plone6/components/Blocks/Section/utils';
import { useLocation } from 'react-router-dom';

import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

// TODO: Allow choosing the heading level of the title.
export function Section({
  title,
  description,
  children,
  padding,
  isBox,
  colour,
  shouldInvert,
  imageSrc = undefined,
}) {
  return (
    <section
      className={cx('nsw-section', {
        [`nsw-section--${padding}-padding`]: padding && padding !== 'full',
        'nsw-section--box': isBox,
        [`nsw-section--${colour}`]: colour,
        'nsw-section--invert': shouldInvert,
        'nsw-section--image': imageSrc,
      })}
      style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : null}
    >
      <div className="nsw-container">
        {title ? <h2 className="nsw-section-title">{title}</h2> : null}
        {description ? <p className="nsw-section-text">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}

/**
 * My cool function.
 *
 * @param {Object} obj
 * @param {string[]} obj.blocksLayout - List of IDs to be displayed in the block, in the order to display them in. Same as `blocks_layout` in content call.
 * @param {Object} obj.blocksData - Data of the blocks to be displayed. Same as `blocks` in content call.
 * @param {string} obj.content - The full content object.
 */
export function BlocksAsSection({ blocksLayout, blocksData, content }) {
  const intl = useIntl();
  const location = useLocation();

  if (!blocksData) {
    return null;
  }

  let blockWithSectionData = Array.isArray(blocksLayout)
    ? blocksLayout?.reduce((foundValue, blockId) => {
        if (foundValue) {
          return foundValue;
        }

        return blocksData[blockId]?.['sectionType']
          ? blocksData[blockId]
          : undefined;
      }, undefined)
    : undefined;

  if (!blockWithSectionData) {
    if (!blocksLayout[0]) {
      return null;
    }
    blockWithSectionData = blocksData[blocksLayout[0]];
  }
  const sectionColour = getSectionColour(blockWithSectionData);

  const blockImageSrc =
    blockWithSectionData?.sectionType === 'image'
      ? blockWithSectionData.sectionimage?.data
        ? `data:${blockWithSectionData.sectionimage['content-type']};base64,${blockWithSectionData.sectionimage.data}`
        : flattenToAppURL(
            `${blockWithSectionData.sectionimage}/@@images/image/great`,
          )
      : null;

  return (
    <Section
      padding={blockWithSectionData.sectionspacing}
      isBox={blockWithSectionData.sectionType === 'box'}
      colour={sectionColour}
      shouldInvert={blockWithSectionData.sectioninvert}
      imageSrc={blockImageSrc}
    >
      {blocksLayout.map((blockId) => {
        // Copy pasted from below. Should really make this a function!
        const blockData = blocksData?.[blockId];
        const blockType = blockData?.['@type'];
        const Block = config.blocks.blocksConfig[blockType]?.['view'] || null;
        return Block !== null ? (
          <Block
            key={blockId}
            id={blockId}
            properties={content}
            data={blocksData[blockId]}
            path={getBaseUrl(location?.pathname || '')}
          />
        ) : (
          <div key={blockId}>
            {intl.formatMessage(messages.unknownBlock, {
              block: blockType,
            })}
          </div>
        );
      })}
    </Section>
  );
}
