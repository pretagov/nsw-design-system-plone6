import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import { announcementBarSchema } from './schema';
import { AnnouncementBarView } from './View';

function AnnouncementBarEditDisplay({ data, id, isEditMode, onSelectBlock }) {
  return <AnnouncementBarView data={data} isEditMode={true} />;
}

function AnnouncementBarData(props) {
  const { data, block, onChangeBlock } = props;
  const schema = announcementBarSchema({ ...props });
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

export function AnnouncementBarEdit(props) {
  const { data, onChangeBlock, block, selected } = props;
  return (
    <>
      <AnnouncementBarEditDisplay data={data} id={block} isEditMode />
      <SidebarPortal selected={selected}>
        <AnnouncementBarData
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
