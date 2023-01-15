import { createContent } from '@plone/volto/actions';
import {
  BlockDataForm,
  SidebarPortal,
  WysiwygWidget,
} from '@plone/volto/components';
import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import TextLineEdit from '@plone/volto/components/manage/TextLineEdit/TextLineEdit';
import { getBaseUrl } from '@plone/volto/helpers';
import { Card } from 'nsw-design-system-plone6/components/Components/Card';
import { readAsDataURL } from 'promise-file-reader';
import { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { singleCardSchema as cardSchema } from './schema';

const messages = defineMessages({
  addImage: {
    id: 'Add image',
    defaultMessage: 'Add image',
  },
});

const validationRules = {
  '\n':
    'Cards should have a single line description. Consider using a content block',
  '</p><p>':
    'Cards should have a single line description. Consider using a content block',
};

function Validation({ messages }) {
  return (
    <>
      {messages.map((message, i) => {
        return (
          <div
            key={i}
            className="nsw-in-page-alert nsw-in-page-alert--warning nsw-in-page-alert--compact"
          >
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
  const intl = useIntl();
  const dispatch = useDispatch();
  const contentCreationAction = useSelector(
    (state) => state.content.subrequests[id],
  );
  const { pathname } = useLocation();
  // TODO: Better styling than inline
  // TODO: Card edit placeholder i18n

  useEffect(() => {
    if (
      contentCreationAction?.data &&
      data.image !== contentCreationAction.data?.['@id']
    ) {
      onChangeBlock(id, {
        ...data,
        image: contentCreationAction.data['@id'],
      });
    }
  }, [contentCreationAction, data, onChangeBlock, id]);

  function imageUpload({ target }) {
    const file = target.files[0];
    readAsDataURL(file).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      dispatch(
        createContent(
          getBaseUrl(pathname),
          {
            '@type': 'Image',
            image: {
              data: fields[3],
              encoding: fields[2],
              'content-type': fields[1],
              filename: file.name,
            },
          },
          id,
        ),
      );
    });
  }

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
        image={
          data.image ? (
            `${data.image}/@@images/image`
          ) : (
            // TODO: Card edit block image field styling is all inline
            <div style={{ marginInline: 'auto', paddingBlockEnd: '6px' }}>
              <label style={{ width: '100%' }}>
                <img style={{ display: 'block' }} src={imageBlockSVG} alt="" />
                <span className="nsw-button nsw-button--dark">
                  {intl.formatMessage(messages.addImage)}
                </span>
                <input
                  type="file"
                  onChange={imageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )
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
