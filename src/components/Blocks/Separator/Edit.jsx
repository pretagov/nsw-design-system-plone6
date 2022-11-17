import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import React from 'react';
import { separatorSchema } from './schema';

function SeparatorEditDisplay() {
  return (
    <hr
      style={{ margin: 0, minWidth: '65vw' }}
      className="nsw-section-separator"
    />
  );
}

function SeparatorData(props) {
  const { data, block, onChangeBlock } = props;
  const schema = separatorSchema({ ...props });
  return (
    <BlockDataForm
      schema={schema}
      title="Separator"
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
}

export function SeparatorEdit(props) {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <SeparatorEditDisplay data={data} id={block} isEditMode />
      <SidebarPortal selected={selected}>
        <SeparatorData
          title={'Separator'}
          key={block}
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
          {...props}
        />
      </SidebarPortal>
    </>
  );
}
