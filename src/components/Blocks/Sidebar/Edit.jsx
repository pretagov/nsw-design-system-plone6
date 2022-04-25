import {
  BlockChooser,
  BlockDataForm,
  Icon,
  SidebarPortal,
} from '@plone/volto/components';
import addSVG from '@plone/volto/icons/add.svg';
import config from '@plone/volto/registry';
import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import SidebarSchema from './schema';
import Sidebar from './Sidebar.jsx';

const useOutsideClick = (ref, callback) => {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      callback(event);
    }
  }

  React.useEffect(() => {
    document.body.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside);
    };
  });
};

const NewBlockAddButton = ({ block, onChangeBlock }) => {
  const ref = React.useRef();
  const [isOpenMenu, setOpenMenu] = React.useState(false);

  useOutsideClick(ref, () => setOpenMenu(false));

  return (
    <>
      {isOpenMenu ? (
        <div ref={ref}>
          <BlockChooser
            onMutateBlock={(block, value) => onChangeBlock(block, value)}
            currentBlock={block}
            showRestricted
          />
        </div>
      ) : (
        <Button
          basic
          icon
          onClick={() => setOpenMenu(true)}
          className="add-block-button"
        >
          <Icon name={addSVG} className="circled" size="24px" />
        </Button>
      )}
    </>
  );
};

function BlockRenderer(props) {
  const { edit, type } = props;

  if (!type) {
    // We could have an empty block, although should be handled somewhere else
    return null;
  }

  // TODO: Shouldn't need to be getting '@type' here
  const EditBlock = config.blocks.blocksConfig[type].edit;
  const ViewBlock = config.blocks.blocksConfig[type].view;

  if (!edit) {
    return <ViewBlock {...props} detached onChangeBlock={() => {}} />;
  }
  if (edit) {
    return <EditBlock {...props} detached index={0} />;
  }
  return '';
}

const SidebarEditDisplay = ({
  data,
  id: blockId,
  manage,
  metadata,
  isEditMode,
  onSelectBlock,
  onChangeBlock,
  pathname,
}) => {
  const [selectedSide, setSelectedSide] = useState(null);

  // Position can be 'side' or 'main'
  const onChangeChildBlock = (position, childData) => {
    onChangeBlock(blockId, {
      ...data,
      [position]: {
        ...data[position],
        ...childData,
      },
    });
  };

  return (
    <>
      <Button
        basic
        icon
        onClick={() => setSelectedSide(null)}
        className="add-block-button"
      >
        Settings
      </Button>
      <Sidebar
        sidebarPosition={data.sidebarPosition}
        SidebarComponent={
          data?.sidebar ? (
            <button
              onClick={() => {
                setSelectedSide('side');
              }}
            >
              <BlockRenderer
                // block={item.id}
                edit
                type={data.sidebar['@type']}
                selected={selectedSide === 'side'}
                onChangeBlock={(blockId, data) => {
                  onChangeChildBlock('sidebar', { blockId: blockId, ...data });
                }}
                data={{ ...data.sidebar }}
              />
            </button>
          ) : (
            <NewBlockAddButton
              onChangeBlock={(blockId, data) => {
                onChangeChildBlock('sidebar', { blockId: blockId, ...data });
              }}
            />
          )
        }
        MainComponent={
          data?.main ? (
            <button
              onClick={() => {
                setSelectedSide('main');
              }}
            >
              <BlockRenderer
                // block={item.id}
                edit
                type={data.main['@type']}
                onChangeBlock={(blockId, data) => {
                  onChangeChildBlock('main', { blockId: blockId, ...data });
                }}
                selected={selectedSide === 'main'}
                data={{ ...data.main }}
              />
            </button>
          ) : (
            <NewBlockAddButton
              onChangeBlock={(blockId, data) => {
                onChangeChildBlock('main', { blockId: blockId, ...data });
              }}
            />
          )
        }
      />
    </>
  );
};

const SidebarData = (props) => {
  const { data, block, onChangeBlock } = props;
  const schema = SidebarSchema({ ...props });
  return (
    <BlockDataForm
      schema={schema}
      title={schema.title}
      onChangeField={(id, value) => {
        onChangeBlock(block, {
          ...data,
          [id]: value,
        });
      }}
      formData={data}
      block={block}
    />
  );
};

const SidebarEdit = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <SidebarEditDisplay
        data={data}
        id={block}
        isEditMode
        onChangeBlock={onChangeBlock}
        {...props}
      />
      <SidebarPortal selected={false}>
        <SidebarData
          key={block}
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
          {...props}
        />
      </SidebarPortal>
    </>
  );
};

export default SidebarEdit;
