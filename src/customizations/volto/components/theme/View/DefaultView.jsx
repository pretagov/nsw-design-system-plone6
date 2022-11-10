import {
  getBaseUrl,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
  Helmet,
} from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';
import { Section } from 'nsw-design-system-plone6/components/Components/Section';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Image } from 'semantic-ui-react';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

// TODO: Have both of these as config.settings options to allow customisation.
const fullWidthBlockTypes = [
  'hero',
  'nsw_section',
  'nsw_inPageAlert',
  'nsw_announcementBar',
  'form',
];
const coreContentBlockTypes = [
  'text',
  'description',
  'image',
  'video',
  'slate',
];

const sectionFields = [
  'sectionspacing',
  'sectionimage',
  'sectionbox',
  'sectioncolour',
  'sectioninvert',
  'sectionshowSeparator',
];

const getCoreContentGroupedLayout = (blocksInLayout, blocksData) => {
  if (!blocksInLayout || !blocksInLayout.length) {
    return [];
  }

  return blocksInLayout?.reduce((result, currentBlockId) => {
    // Handles the messy case where a block is not in the layout
    //    but is stored. This is a rare case, but it happens.
    if (!blocksInLayout.includes(currentBlockId)) {
      return result;
    }
    // Handles the case where the block is in the layout but doesn't
    //   exist.
    if (!blocksData[currentBlockId]) {
      return result;
    }

    const currentBlock = blocksData[currentBlockId];
    const currentBlockType = currentBlock['@type'];
    const previousBlockOrGroup = result[result.length - 1];
    const previousBlock =
      previousBlockOrGroup instanceof Array
        ? blocksData[previousBlockOrGroup[previousBlockOrGroup.length - 1]]
        : blocksData[previousBlockOrGroup];

    if (_blockNeedsSection(currentBlock)) {
      // Make sure we have another block
      if (previousBlockOrGroup) {
        const previousBlockSectionData = Object.fromEntries(
          sectionFields.map((k) => [k, previousBlock?.[k]]),
        );
        const currentBlockSectionData = Object.fromEntries(
          sectionFields.map((k) => [k, currentBlock?.[k]]),
        );

        if (
          JSON.stringify(previousBlockSectionData) ===
          JSON.stringify(currentBlockSectionData)
        ) {
          previousBlockOrGroup.push(currentBlockId);
          result.splice(result.length - 1, 1, previousBlockOrGroup);
        } else {
          result.push([currentBlockId]);
        }
      } else {
        result.push([currentBlockId]);
      }
      return result;
    }

    // If the previous block is a group and the current block is a core content block,
    // add the current block to the group.
    if (previousBlock && _blockNeedsSection(previousBlock)) {
      result.push([currentBlockId]);
    } else if (
      previousBlockOrGroup instanceof Array &&
      coreContentBlockTypes.includes(currentBlockType)
    ) {
      previousBlockOrGroup.push(currentBlockId);
      result.splice(result.length - 1, 1, previousBlockOrGroup);
    }
    // Otherwise, if the previous block is not a core content
    // block or a group, return a new group.
    else if (coreContentBlockTypes.includes(currentBlockType)) {
      result.push([currentBlockId]);
    }
    // Otherwise, return the previous block as is.
    else {
      result.push(currentBlockId);
    }

    return result;
  }, []);
};

function _blockNeedsSection(blockData) {
  if (Object.keys(blockData).some((r) => sectionFields.includes(r))) {
    return true;
  }
  return false;
}

const BlocksLayout = ({ content, location }) => {
  const intl = useIntl();
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
  const blocksInLayout = content[blocksLayoutFieldname].items;
  const blocksData = content[blocksFieldname];
  const groupedBlocksLayout = getCoreContentGroupedLayout(
    blocksInLayout,
    blocksData,
  );

  return (
    <div id="page-document">
      <div className="nsw-layout">
        <div
          className="nsw-layout__main"
          style={
            fullWidthBlockTypes.includes(
              blocksData[blocksInLayout[0]]?.['@type'],
            )
              ? { paddingBlockStart: '0' }
              : null
          }
        >
          {groupedBlocksLayout.map((blockIdOrGroup, index) => {
            if (blockIdOrGroup instanceof Array) {
              const blockGroup = blockIdOrGroup; // Rename it just to make the code more readable
              if (_blockNeedsSection(blocksData?.[blockGroup[0]])) {
                const blockWithSectionData = blocksData?.[blockGroup[0]];
                // debugger;
                return (
                  <Section
                    // title={blockData.title}
                    // description={blockData.description}
                    padding={blockWithSectionData.sectionspacing}
                    isBox={blockWithSectionData.sectionbox}
                    colour={blockWithSectionData.sectioncolour}
                    shouldInvert={blockWithSectionData.sectioninvert}
                    showSeparator={blockWithSectionData.sectionshowSeparator}
                  >
                    {blockGroup.map((blockId) => {
                      // Copy pasted from below. Should really make this a function!
                      const blockData = blocksData?.[blockId];
                      const blockType = blockData?.['@type'];
                      const Block =
                        config.blocks.blocksConfig[blockType]?.['view'] || null;
                      // debugger;
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
              return (
                <div
                  key={`blockgroup-${index}`}
                  className={cx('nsw-container', {
                    'nsw-p-bottom-md': index + 1 === groupedBlocksLayout.length,
                  })}
                >
                  {blockGroup.map((blockId) => {
                    // Copy pasted from below. Should really make this a function!
                    const blockData = blocksData?.[blockId];
                    const blockType = blockData?.['@type'];
                    const Block =
                      config.blocks.blocksConfig[blockType]?.['view'] || null;
                    // debugger;
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
                </div>
              );
            }
            const blockId = blockIdOrGroup; // Rename it just to make the code more readable
            const blockData = blocksData?.[blockId];
            const blockType = blockData?.['@type'];
            const Block =
              config.blocks.blocksConfig[blockType]?.['view'] || null;
            if (Block === null) {
              return (
                <div key={blockId}>
                  {intl.formatMessage(messages.unknownBlock, {
                    block: blockType,
                  })}
                </div>
              );
            }
            return fullWidthBlockTypes.includes(blockType) ? (
              <Block
                key={blockId}
                id={blockId}
                properties={content}
                data={blocksData[blockId]}
                path={getBaseUrl(location?.pathname || '')}
              />
            ) : (
              <div
                key={blockId}
                className={cx('nsw-container', {
                  'nsw-p-bottom-md':
                    index + 1 === groupedBlocksLayout.length &&
                    blockType !== 'nsw_section',
                })}
              >
                <Block
                  id={blockId}
                  properties={content}
                  data={blocksData[blockId]}
                  path={getBaseUrl(location?.pathname || '')}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PloneClassicLayout = ({ content }) => {
  return (
    <div id="page-document" className="nsw-container">
      <div className="nsw-layout">
        <div className="nsw-layout__main">
          <h1 className="documentFirstHeading">{content.title}</h1>
          {content.description && (
            <p className="documentDescription">{content.description}</p>
          )}
          {content.image && (
            <Image
              className="document-image"
              src={content.image.scales.thumb.download}
              floated="right"
            />
          )}
          {content.remoteUrl && (
            <span>
              The link address is:
              <a href={content.remoteUrl}>{content.remoteUrl}</a>
            </span>
          )}
          {content.text && (
            <div
              dangerouslySetInnerHTML={{
                __html: content.text.data,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const colourFieldnameVariableMapping = {
  nsw_brand_dark: 'nsw-brand-dark',
  nsw_brand_light: 'nsw-brand-light',
  nsw_brand_accent: 'nsw-brand-accent',
  nsw_brand_supplementary: 'nsw-brand-supplementary',
};

const DefaultView = ({ content, location }) => {
  const { siteSettings } = useSelector((state) => ({
    siteSettings: state.nswSiteSettings.data,
  }));

  // TODO: This currently spits out a list of null values, which is not valid for `Object.fromEntries`
  const coloursToSet = Object.keys(colourFieldnameVariableMapping)
    .map((fieldname) => {
      const value = siteSettings?.[fieldname];
      if (!value) {
        return null;
      }
      return [colourFieldnameVariableMapping[fieldname], value];
    })
    .filter((value) => !!value);

  return (
    <>
      {coloursToSet && coloursToSet.length > 0 ? (
        <Helmet
          // TODO: This creates multiple style tags, we should merge them into a single one.
          style={coloursToSet.map(([variableName, value]) => {
            return {
              type: 'text/css',
              cssText: `:root { --${variableName}: var(--nsw-palette-${value}) }`,
            };
          })}
        />
      ) : null}
      {hasBlocksData(content) ? (
        <BlocksLayout content={content} location={location} />
      ) : (
        <PloneClassicLayout content={content} />
      )}
    </>
  );
};

DefaultView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    text: PropTypes.shape({
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default DefaultView;
