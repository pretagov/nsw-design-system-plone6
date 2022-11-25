import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import React from 'react';
import { heroSearchSchema } from './schema';
import { HeroSearchView } from './View';

function HeroSearchEditDisplay({ data }) {
  return <HeroSearchView data={data} />;
}

function HeroSearchData(props) {
  const { data, block, onChangeBlock } = props;
  const schema = heroSearchSchema({ ...props });
  return (
    <BlockDataForm
      schema={schema}
      title="HeroSearch"
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

export function HeroSearchEdit(props) {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <HeroSearchEditDisplay data={data} id={block} isEditMode />
      <SidebarPortal selected={selected}>
        <HeroSearchData
          title={'HeroSearch'}
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
