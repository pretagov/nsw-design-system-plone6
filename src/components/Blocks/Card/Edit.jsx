import {
  BlockDataForm,
  SidebarPortal,
  WysiwygWidget,
} from '@plone/volto/components';
import TextLineEdit from '@plone/volto/components/manage/TextLineEdit/TextLineEdit';
import { Card } from 'nsw-design-system-plone6/components/Components/Card';
import { singleCardSchema as cardSchema } from './schema';

const validationRules = {
  '\n':
    'Cards should have a single line description. Consider using a content block',
  '</p><p>':
    'Cards should have a single line description. Consider using a content block',
};

function Validation({ messages }) {
  return (
    <>
      {messages.map((message) => {
        return (
          <div className="nsw-in-page-alert nsw-in-page-alert--warning nsw-in-page-alert--compact">
            <span className="nsw-in-page-alert__content">
              <p className="nsw-small">
                <span
                  className="material-icons nsw-material-icons nsw-in-page-alert__icon"
                  focusable="false"
                  aria-hidden="true"
                >
                  error
                </span>
                {message}
              </p>
            </span>
          </div>
        );
      })}
    </>
  );
}

function CardEditDisplay({ data, id, onChangeBlock }) {
  // TODO: Better styling than inline
  // TODO: Card edit placeholder i18n

  const warnings = Object.entries(validationRules)
    .map(([regex, message]) => {
      if (RegExp(regex, 'g').test(data.description?.data)) {
        return message;
      }

      return null;
    })
    .filter((message) => message);

  return (
    <div>
      <Card
        {...data}
        title={
          <div style={{ cursor: 'text' }}>
            <TextLineEdit
              fieldName="title"
              fieldDataName="title"
              placeholder="Add a title..."
              block={id}
              data={data}
              onChangeBlock={(blockId, newData) => {
                onChangeBlock(blockId, newData);
              }}
              renderTag="span"
            />
          </div>
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
            placeholder="Add a description..."
            value={data.description}
          />
        }
        isEditMode={true}
      />
      <Validation messages={warnings} />
    </div>
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
