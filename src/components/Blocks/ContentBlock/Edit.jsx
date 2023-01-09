import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import { ContentBlock } from 'nsw-design-system-plone6/components/Components/ContentBlock';
import { getLinks, getViewMore } from './helpers';
import { contentBlockSchema } from './schema';

function ContentBlockEditDisplay({ data }) {
  return (
    <ContentBlock
      title={data.title}
      description={data.description}
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
}
