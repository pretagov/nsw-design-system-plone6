import { createContent } from '@plone/volto/actions';
import {
  BlockDataForm,
  SidebarPopup,
  SidebarPortal,
  TextWidget,
  WysiwygWidget,
} from '@plone/volto/components';

import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import ObjectBrowserBody from '@plone/volto/components/manage/Sidebar/ObjectBrowserBody';
import TextLineEdit from '@plone/volto/components/manage/TextLineEdit/TextLineEdit';
import { getBaseUrl } from '@plone/volto/helpers';
import { getHref } from 'nsw-design-system-plone6/components/Blocks/Card/helpers';
import {
  Card,
  DefaultIcon,
} from 'nsw-design-system-plone6/components/Components/Card';
import { ImagePickerWidget } from 'nsw-design-system-plone6/components/Widgets';
import { readAsDataURL } from 'promise-file-reader';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Segment } from 'semantic-ui-react';
import { singleCardSchema as cardSchema } from './schema';

// Delete image button
import { Icon } from '@plone/volto/components';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Button } from 'semantic-ui-react';

const validationRules = {
  '\n':
    'Cards should have a single line description. Consider using a content block',
  '</p><':
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

function CardEditDisplayComponent({
  data,
  id,
  onChangeBlock,
  openObjectBrowser,
}) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const contentCreationAction = useSelector(
    (state) => state.content.subrequests[id],
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // TODO: Better styling than inline
  // TODO: Card edit placeholder i18n

  // TODO: This will stomp over changes made to the image.
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
      {data.image ? (
        <div className="toolbar" style={{ top: '5px', left: '5px' }}>
          <>
            <Button.Group>
              <Button
                aria-label={`Select grid block`}
                icon
                basic
                onClick={(e) => {
                  e.stopPropagation();
                  const dataWithoutImage = data;
                  delete dataWithoutImage.image;
                  onChangeBlock(id, dataWithoutImage);
                }}
              >
                <Icon name={clearSVG} size="24px" />
              </Button>
            </Button.Group>
          </>
        </div>
      ) : null}
      <Card
        {...data}
        title={
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
        }
        description={
          <>
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
          </>
        }
        image={
          data.image ? (
            `${data.image}/@@images/image`
          ) : (
            <ImagePickerWidget onChange={imageUpload} />
          )
        }
        icon={
          <button
            style={{ border: 0, padding: 0 }}
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          >
            <span className="sr-only">Edit link</span>
            <DefaultIcon />
          </button>
        }
        isEditMode={true}
      />
      <SidebarPopup open={isSidebarOpen} onClose={() => {}} overlay={false}>
        <div className="object-browser-with-input">
          <Segment.Group
            attached="bottom"
            style={{
              height: 'unset',
              marginBlock: '0 !important',
              paddingBlock: '1rem',
            }}
          >
            <div className="ui form">
              <TextWidget
                title="Link URL"
                wrapped={true}
                value={getHref(data)}
                onChange={(_, value) => {
                  onChangeBlock(id, {
                    ...data,
                    link: value,
                  });
                }}
              />
            </div>
          </Segment.Group>
          <ObjectBrowserBody
            data={data}
            block={id}
            dataName={'link'}
            mode={'link'}
            contextURL={getBaseUrl(pathname)}
            closeObjectBrowser={() => {
              setIsSidebarOpen(false);
            }}
            onSelectItem={() => {
              setIsSidebarOpen(false);
            }}
            onChangeBlock={onChangeBlock}
          />
        </div>
      </SidebarPopup>
      <Validation messages={warnings} />
    </div>
  );
}

const CardEditDisplay = withObjectBrowser(CardEditDisplayComponent);

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
