import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import React from 'react';
import { DropdownQuickNavigationSchema } from './schema';
import { DropdownQuickNavigationView as View } from './View';

function DropdownQuickNavigationEditDisplay({
  data,
  id,
  isEditMode,
  onSelectBlock,
}) {
  return (
    <>
      <p>Quick navigation: </p>
      <View data={data} isEditMode={true} />
    </>
  );
}

function DropdownQuickNavigationData(props) {
  const { data, block, onChangeBlock } = props;
  const schema = DropdownQuickNavigationSchema({ ...props });
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
}

export function DropdownQuickNavigationEdit(props) {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <DropdownQuickNavigationEditDisplay data={data} id={block} isEditMode />
      <SidebarPortal selected={selected}>
        <DropdownQuickNavigationData
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
