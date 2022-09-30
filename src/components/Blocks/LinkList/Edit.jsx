import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import React from 'react';
import { useIntl } from 'react-intl';
import { linkListSchema } from './schema';
import { LinkListView as View } from './View';

function LinkListEditDisplay({ data, id, isEditMode, onSelectBlock }) {
  const intl = useIntl();
  const { title, description } = data;

  return (
    <>
      {!data.links || data.links.length === 0 ? <h2>Empty link list</h2> : null}
      <View data={data} isEditMode={isEditMode} />
    </>
  );
}

function LinkListData(props) {
  const { data, block, onChangeBlock } = props;
  const schema = linkListSchema({ ...props });
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
}

// TODO: Support for tags and support for dates
export function LinkListEdit(props) {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <LinkListEditDisplay data={data} id={block} isEditMode />
      <SidebarPortal selected={selected}>
        <LinkListData
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
