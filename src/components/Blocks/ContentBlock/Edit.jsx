import {
  BlockDataForm,
  SidebarPortal,
  WysiwygWidget,
} from '@plone/volto/components';
import TextLineEdit from '@plone/volto/components/manage/TextLineEdit/TextLineEdit';
import { ContentBlock } from 'nsw-design-system-plone6/components/Components/ContentBlock';
import { getLinks, getViewMore } from './helpers';
import { contentBlockSchema } from './schema';

function ContentBlockEditDisplay({ data, id, onChangeBlock, ...props }) {
  // Needed to prevent the fallback using the content object. Caused by passing `...props`
  delete props.metadata;
  delete props.properties;

  return (
    <ContentBlock
      title={
        <TextLineEdit
          {...props}
          fieldName="title"
          fieldDataName="title"
          placeholder="Add a content block title..."
          block={id}
          data={data}
          onChangeBlock={(blockId, newData) => {
            onChangeBlock(blockId, newData);
          }}
          renderTag="span"
        />
      }
      description={
        <WysiwygWidget
          title={id}
          wrapped={false}
          id={id}
          name={id}
          onChange={(blockId, value) => {
            onChangeBlock(blockId, {
              ...data,
              description: value,
            });
          }}
          // TODO: content block  placeholder i18n
          placeholder="Add a content block description..."
          value={data.description}
        />
      }
      viewMoreUrl={getViewMore(data)}
      links={getLinks(data)}
      image={data.image}
      imageIsIcon={data.imageIsIcon}
      isEditMode={true}
    />
  );
}

function ContentBlockData(props) {
  const { data, block, onChangeBlock } = props;
  const schema = contentBlockSchema({ ...props });
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

export function ContentBlockEdit(props) {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <ContentBlockEditDisplay
        {...props}
        data={data}
        id={block}
        onChangeBlock={onChangeBlock}
      />
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
}
