import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import React from 'react';
import InPageAlertSchema from './schema';
import View from './View';

const InPageAlertEditDisplay = ({ data, id, isEditMode, onSelectBlock }) => {
  return <View data={data} isEditMode={true} />;
};

const InPageAlertData = (props) => {
  const { data, block, onChangeBlock } = props;
  const schema = InPageAlertSchema({ ...props });
  return (
    <div>
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
    </div>
  );
};

const InPageAlertEdit = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <InPageAlertEditDisplay data={data} id={block} isEditMode />
      <SidebarPortal selected={selected}>
        <InPageAlertData
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

export default InPageAlertEdit;
