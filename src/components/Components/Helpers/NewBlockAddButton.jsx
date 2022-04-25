import React, { useState } from 'react';

import { BlockChooser, Icon } from '@plone/volto/components';
import { useDetectClickOutside } from '@plone/volto/helpers';
import { Button } from 'semantic-ui-react';

import addSVG from '@plone/volto/icons/add.svg';

export const NewBlockAddButton = ({
  allowedBlocks,
  block,
  onChangeBlock,
  inverted = undefined,
}) => {
  const [isOpenMenu, setOpenMenu] = useState(false);

  const outsideClickRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenMenu(false);
    },
    triggerKeys: ['Escape'],
    disableClick: true,
  });

  return isOpenMenu ? (
    <BlockChooser
      ref={outsideClickRef}
      onMutateBlock={(block, value) => {
        // Fixed and required here ensure we can't drag or delete the
        //   child block from the BlockForm, only the toolbar.
        onChangeBlock(block, { ...value, fixed: true, required: true });
        setOpenMenu(false);
      }}
      currentBlock={block}
      showRestricted
      allowedBlocks={allowedBlocks}
    />
  ) : (
    <Button
      basic={!inverted}
      inverted={inverted}
      icon
      onClick={() => {
        setOpenMenu(true);
      }}
      className="add-block-button"
      aria-label={`Add block`}
    >
      <Icon name={addSVG} size="24px" />
    </Button>
  );
};

export default NewBlockAddButton;
