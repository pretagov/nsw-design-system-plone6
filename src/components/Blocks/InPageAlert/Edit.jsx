import {
  BlockDataForm,
  SidebarPortal,
  WysiwygWidget,
} from '@plone/volto/components';
import { InPageAlert } from 'nsw-design-system-plone6/components/Components/InPageAlert';
import InPageAlertSchema from './schema';

const InPageAlertEditDisplay = ({ data, id, onChangeBlock, schema }) => {
  return (
    <InPageAlert
      alertType={data.alertType}
      content={
        <div style={{ minWidth: '30%' }}>
          <WysiwygWidget
            title={id}
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
      includeMargin={data.includeMargin}
      isCompact={data.isCompact}
    />
  );
};

const InPageAlertData = (props) => {
  const { data, block, onChangeBlock, schema } = props;
  const defaultFieldsetIndex = schema.fieldsets.findIndex(
    (fieldset) => fieldset.id === 'default',
  );
  // Remove 'body' from the schema to display
  schema.fieldsets[defaultFieldsetIndex].fields = schema.fieldsets[
    defaultFieldsetIndex
  ].fields.filter((field) => field !== 'body');
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

const InPageAlertEdit = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  const schema = InPageAlertSchema({ ...props });
  return (
    <>
      <InPageAlertEditDisplay {...props} schema={schema} />
      <SidebarPortal selected={selected}>
        <InPageAlertData
          key={block}
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
          schema={schema}
          {...props}
        />
      </SidebarPortal>
    </>
  );
};

export default InPageAlertEdit;
