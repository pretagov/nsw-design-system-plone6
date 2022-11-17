import {
  BlockDataForm,
  BlocksForm,
  Icon,
  SidebarPortal,
} from '@plone/volto/components';
import {
  blockHasValue,
  deleteBlock,
  emptyBlocksForm,
} from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { isEmpty } from 'lodash';
import NewBlockAddButton from 'nsw-design-system-plone6/components/Components/Helpers/NewBlockAddButton';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';
import { Section } from '../../Components/Section';
import schema from './schema';

import clearSVG from '@plone/volto/icons/clear.svg';
import configSVG from '@plone/volto/icons/configuration.svg';

const SubblockEdit = ({
  block: sectionBlockId,
  data,
  onChangeBlock,
  selected,
  onChangeField,
  pathname,
  manage,
  metadata,
  properties,
}) => {
  const intl = useIntl();
  const [selectedBlock, setSelectedBlock] = useState(sectionBlockId);
  const [blockState, setBlockState] = useState({});

  const childBlockId = data.block?.blocks_layout?.items[0];

  // TODO: Make this configurable per-block
  const disallowedBlocks = ['nsw_section'];
  const defaultAllowedBlocks = Object.keys(config.blocks.blocksConfig).filter(
    (blockId) => {
      return !disallowedBlocks.includes(blockId);
    },
  );
  const allowedBlocks = data.allowedBlocks || defaultAllowedBlocks;

  const ownerBlockMetadata = metadata || properties;
  const childBlockdata = isEmpty(data?.block?.blocks)
    ? emptyBlocksForm()
    : data.block;

  // We need to useCallback to ensure the function signature is
  //   the same between renders for the initialisation effect.
  const setInitialData = React.useCallback(() => {
    // TODO: Schema enhancer support
    // const enhancedSchema = applySchemaEnhancer(schema({ intl }), data);
    const enhancedSchema = schema ? schema({ intl }) : null;
    const defaultValues = Object.keys(enhancedSchema?.properties ?? {}).reduce(
      (accumulator, currentVal) => {
        return enhancedSchema.properties[currentVal].default
          ? {
              ...accumulator,
              [currentVal]: enhancedSchema.properties[currentVal].default,
            }
          : accumulator;
      },
      {},
    );

    return {
      ...defaultValues,
      ...data,
      block: {
        ...childBlockdata,
      },
    };
  }, [data, intl, childBlockdata]);
  React.useEffect(() => {
    if (isEmpty(data.block)) {
      onChangeBlock(sectionBlockId, setInitialData());
    }
  }, [sectionBlockId, data.block, setInitialData, onChangeBlock]);

  return (
    <>
      {selected ? (
        <div className="toolbar">
          <>
            <Button.Group>
              {data.block?.blocks &&
              blockHasValue(data.block.blocks[childBlockId]) ? (
                <Button
                  aria-label={`Clear section content`}
                  icon
                  basic
                  onClick={() => {
                    const [newBlockId, newBlockData] = deleteBlock(
                      data.block,
                      childBlockId,
                    );
                    // Prepare the new child block before adding it to the section.
                    onChangeBlock(newBlockId, {
                      ...newBlockData.blocks[newBlockId],
                      fixed: true,
                      required: true,
                    });
                    onChangeBlock(sectionBlockId, {
                      ...data,
                      block: {
                        ...newBlockData,
                      },
                    });
                    setBlockState({});
                  }}
                >
                  <Icon name={clearSVG} size="24px" />
                </Button>
              ) : (
                <NewBlockAddButton
                  block={childBlockId}
                  onChangeBlock={(block, newValues) => {
                    const newBlock = {
                      ...data.block.blocks[block],
                      ...newValues,
                    };
                    onChangeBlock(sectionBlockId, {
                      ...data,
                      block: {
                        ...data.block,
                        blocks: {
                          ...data.block.blocks,
                          [block]: newBlock,
                        },
                      },
                    });
                  }}
                  allowedBlocks={allowedBlocks}
                />
              )}
              <Button
                aria-label={`Select grid block`}
                icon
                basic
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlock(sectionBlockId);
                }}
              >
                <Icon name={configSVG} size="24px" />
              </Button>
            </Button.Group>
          </>
        </div>
      ) : null}
      <Section
        title={data.title}
        description={data.description}
        padding={data.spacing}
        isBox={data.sectionType === 'box'}
        colour={data.colour}
        shouldInvert={data.invert}
        imageSrc={
          data.image
            ? `data:${data.image['content-type']};base64,${data.image.data}`
            : null
        }
        showSeparator={data.showSeparator}
      >
        <>
          {data.block && blockHasValue(data?.block.blocks[childBlockId]) ? (
            <BlocksForm
              key={childBlockId}
              title={data.placeholder}
              manage={manage}
              allowedBlocks={allowedBlocks}
              metadata={{ ...ownerBlockMetadata, disableNewBlocks: true }}
              properties={childBlockdata}
              selectedBlock={selected ? selectedBlock : null}
              onSelectBlock={(id) => {
                setSelectedBlock(id);
              }}
              disableNewBlocks={true}
              onChangeFormData={(newFormData) => {
                onChangeBlock(sectionBlockId, {
                  ...data,
                  block: {
                    ...data.block,
                    ...newFormData,
                  },
                });
              }}
              onChangeField={(id, value) => {
                if (['blocks', 'blocks_layout'].indexOf(id) > -1) {
                  blockState[id] = value;
                  onChangeBlock(sectionBlockId, {
                    ...data,
                    data: {
                      blocks: {
                        [childBlockId]: {
                          ...blockState,
                        },
                      },
                    },
                  });
                } else {
                  onChangeField(id, value);
                }
              }}
              pathname={pathname}
            />
          ) : null}
        </>
      </Section>

      <SidebarPortal selected={selected && selectedBlock === sectionBlockId}>
        <BlockDataForm
          schema={schema({ intl, formData: data })}
          title="Section block"
          onChangeField={(id, value) => {
            onChangeBlock(sectionBlockId, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
          block={sectionBlockId}
        />
      </SidebarPortal>
    </>
  );
};

export default SubblockEdit;
