import {
  BlockDataForm,
  SidebarPortal,
  WysiwygWidget,
} from '@plone/volto/components';
import { InPageAlert } from 'nsw-design-system-plone6/components/Components/InPageAlert';
import { announcementBarSchema } from './schema';

function AnnouncementBarEditDisplay({ data, id, onChangeBlock }) {
  return (
    <InPageAlert
      alertType="chevron_right"
      content={
        <div style={{ minWidth: '30%' }}>
          <WysiwygWidget
            wrapped={false}
            id={id}
            name={id}
            onChange={(blockId, value) => {
              onChangeBlock(blockId, {
                ...data,
                body: value,
              });
            }}
            // TODO: in-page alert placeholder i18n
            placeholder="Enter your alert message here"
            value={data.body}
          />
        </div>
      }
      includeMargin={true}
      includeContainer={true}
      isCompact={data.isCompact}
      colour={data.colour}
    />
  );
}

function AnnouncementBarData({ data, block, onChangeBlock, schema }) {
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
  const schema = announcementBarSchema({ ...props });
  return (
    <>
      <AnnouncementBarEditDisplay
        data={data}
        id={block}
        onChangeBlock={onChangeBlock}
      />
      <SidebarPortal selected={selected}>
        <AnnouncementBarData
          key={block}
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
          schema={schema}
        />
      </SidebarPortal>
    </>
  );
}
