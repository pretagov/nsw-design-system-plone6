import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import React from 'react';
import { useIntl } from 'react-intl';
import CardSchema from './schema';
import Card from './View';

const CardEditDisplay = ({ data, id, isEditMode, onSelectBlock }) => {
  const intl = useIntl();
  const { title, description } = data;

  return <Card data={data} isEditMode={isEditMode} />;
};

const CardData = (props) => {
  const { data, block, onChangeBlock } = props;
  const schema = CardSchema({ ...props });
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

// TODO: Support for tags and support for dates
const CardEdit = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <CardEditDisplay data={data} id={block} isEditMode />
      <SidebarPortal selected={selected}>
        <CardData
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

export default CardEdit;
