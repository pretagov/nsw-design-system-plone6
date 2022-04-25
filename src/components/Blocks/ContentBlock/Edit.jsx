import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import React from 'react';
import { useIntl } from 'react-intl';
import ContentBlockSchema from './schema';
import ContentBlock from './View';

const ContentBlockEditDisplay = ({ data, id, isEditMode, onSelectBlock }) => {
  const intl = useIntl();
  const { title, description } = data;

  return <ContentBlock data={data} isEditMode={isEditMode} />;
};

const ContentBlockData = (props) => {
  const { data, block, onChangeBlock } = props;
  const schema = ContentBlockSchema({ ...props });
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

const ContentBlockEdit = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <ContentBlockEditDisplay data={data} id={block} isEditMode />
      <SidebarPortal selected={selected}>
        <ContentBlockData
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

export default ContentBlockEdit;
