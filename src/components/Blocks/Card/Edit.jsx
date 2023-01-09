import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import TextLineEdit from '@plone/volto/components/manage/TextLineEdit/TextLineEdit';
import { Card } from 'nsw-design-system-plone6/components/Components/Card';
import { cardSchema } from './schema';

function CardEditDisplay({ data, id, onChangeBlock }) {
  return (
    <Card
      {...data}
      title={
        // TODO: Better styling than inline
        <div style={{ cursor: 'text' }}>
          <TextLineEdit
            fieldName="title"
            fieldDataName="title"
            placeholder="Card title"
            block={id}
            data={data}
            onChangeBlock={(blockId, newData) => {
              onChangeBlock(blockId, newData);
            }}
            renderTag="span"
          />
        </div>
      }
      isEditMode={true}
    />
  );
}

function CardData(props) {
  const { data, block, onChangeBlock } = props;
  const schema = cardSchema({ intl: props.intl });
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
export function CardEdit(props) {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <CardEditDisplay
        data={data}
        id={block}
        onChangeBlock={onChangeBlock}
        isEditMode
      />
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
}
