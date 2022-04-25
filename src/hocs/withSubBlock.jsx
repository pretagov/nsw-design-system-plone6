import React, { useState } from 'react';

import { BlocksForm, Icon } from '@plone/volto/components';
import {
  blockHasValue,
  deleteBlock,
  emptyBlocksForm,
} from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';
import NewBlockAddButton from '../components/Components/Helpers/NewBlockAddButton';

import clearSVG from '@plone/volto/icons/clear.svg';
import configSVG from '@plone/volto/icons/configuration.svg';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const withSubBlock = (blockSchema) => (WrappedComponent) => {
  function WithSubBlock(props) {
    const {
      block: ownerBlockID,
      data,
      selected,
      pathname,
      manage,
      onChangeBlock,
      onChangeField,
    } = props;
    const intl = useIntl();
    const [selectedBlock, setSelectedBlock] = useState(ownerBlockID);
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

    const ownerBlockMetadata = props.metadata || props.properties;
    const childBlockdata = isEmpty(data?.block?.blocks)
      ? emptyBlocksForm()
      : data.block;

    // We need to useCallback to ensure the function signature is
    //   the same between renders for the initialisation effect.
    const setInitialData = React.useCallback(() => {
      // TODO: Schema enhancer support
      // const enhancedSchema = applySchemaEnhancer(schema({ intl }), data);
      const enhancedSchema = blockSchema ? blockSchema({ intl }) : null;
      const defaultValues = Object.keys(
        enhancedSchema?.properties ?? {},
      ).reduce((accumulator, currentVal) => {
        return enhancedSchema.properties[currentVal].default
          ? {
              ...accumulator,
              [currentVal]: enhancedSchema.properties[currentVal].default,
            }
          : accumulator;
      }, {});

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
        onChangeBlock(ownerBlockID, setInitialData());
      }
    }, [ownerBlockID, data.block, setInitialData, onChangeBlock]);

    const ToolbarButtons = ({
      data,
      childBlockId,
      deleteBlock,
      onChangeBlock,
      ownerBlockID,
      setBlockState,
      allowedBlocks,
      setSelectedBlock,
    }) => (
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
                onChangeBlock(ownerBlockID, {
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
                onChangeBlock(ownerBlockID, {
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
              setSelectedBlock(ownerBlockID);
            }}
          >
            <Icon name={configSVG} size="24px" />
          </Button>
        </Button.Group>
      </>
    );

    const BlockEditor = ({
      blockHasValue,
      childBlockId,
      manage,
      allowedBlocks,
      ownerBlockMetadata,
      childBlockdata,
      selected,
      selectedBlock,
      setSelectedBlock,
      onChangeBlock,
      ownerBlockID,
      blockState,
      onChangeField,
      pathname,
    }) => {
      return (
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
                onChangeBlock(ownerBlockID, {
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
                  onChangeBlock(ownerBlockID, {
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
      );
    };

    // Pass the existing props and add our new ones
    return (
      <WrappedComponent
        {...props}
        selectedBlock={selectedBlock}
        BlockEditor={
          <BlockEditor
            blockHasValue={blockHasValue}
            childBlockId={childBlockId}
            manage={manage}
            allowedBlocks={allowedBlocks}
            ownerBlockMetadata={ownerBlockMetadata}
            childBlockdata={childBlockdata}
            selected={selected}
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
            onChangeBlock={onChangeBlock}
            ownerBlockID={ownerBlockID}
            blockState={blockState}
            onChangeField={onChangeField}
            pathname={pathname}
          />
        }
        ToolbarButtons={
          <ToolbarButtons
            data={data}
            childBlockId={childBlockId}
            deleteBlock={deleteBlock}
            onChangeBlock={onChangeBlock}
            ownerBlockID={ownerBlockID}
            setBlockState={setBlockState}
            allowedBlocks={allowedBlocks}
            setSelectedBlock={setSelectedBlock}
          />
        }
      />
    );
  }
  WithSubBlock.displayName = `WithSubBlock(${getDisplayName(
    WrappedComponent,
  )})`;

  return WithSubBlock;
};

export default withSubBlock;
