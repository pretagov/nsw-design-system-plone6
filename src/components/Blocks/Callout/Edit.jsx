import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import React from 'react';
import CalloutSchema from './schema';
import Callout from './View';

const CalloutEditDisplay = ({ data, id, isEditMode, onSelectBlock }) => {
  return <Callout data={data} isEditMode={isEditMode} />;
};

const CalloutData = (props) => {
  const { data, block, onChangeBlock } = props;
  const schema = CalloutSchema({ ...props });
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

const CalloutEdit = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <CalloutEditDisplay data={data} id={block} isEditMode />
      <SidebarPortal selected={selected}>
        <CalloutData
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

export default CalloutEdit;
