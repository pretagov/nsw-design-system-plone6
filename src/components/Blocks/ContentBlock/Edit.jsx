import {
  BlockDataForm,
  SidebarPortal,
  WysiwygWidget,
} from '@plone/volto/components';
import TextLineEdit from '@plone/volto/components/manage/TextLineEdit/TextLineEdit';
import { ContentBlock } from 'nsw-design-system-plone6/components/Components/ContentBlock';
import { useEffect, useState } from 'react';
import { getLinks, getViewMore } from './helpers';
import { contentBlockSchema } from './schema';

// ImageUpload
import { createContent } from '@plone/volto/actions';
import { getBaseUrl } from '@plone/volto/helpers';
import { ImagePickerWidget } from 'nsw-design-system-plone6/components/Widgets';
import { readAsDataURL } from 'promise-file-reader';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

// Toolbar
import { Icon } from '@plone/volto/components';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Button } from 'semantic-ui-react';

// CustomLinkPicker
import { SidebarPopup, TextWidget } from '@plone/volto/components';
import ObjectBrowserBody from '@plone/volto/components/manage/Sidebar/ObjectBrowserBody';
import { Segment } from 'semantic-ui-react';

function ContentBlockEditDisplay({ data, id, onChangeBlock, ...props }) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  // Needed to prevent the fallback using the content object. Caused by passing `...props`
  delete props.metadata;
  delete props.properties;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // TODO: This will stomp over changes made to the image.
  const contentCreationAction = useSelector(
    (state) => state.content.subrequests[id],
  );
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

  return (
    <>
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
      <ContentBlock
        {...data}
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
            // Below are all needed to appease PropTypes
            properties={data}
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
        image={
          data.imagePosition !== 'hidden' ? (
            data.image ? (
              `${data.image}/@@images/image`
            ) : (
              <ImagePickerWidget onChange={imageUpload} />
            )
          ) : null
        }
        // viewMoreUrl={getViewMore(data)}
        viewMoreUrl={
          <button
            className="nsw-button nsw-button--dark"
            // style={{ border: 0, padding: 0 }}
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          >
            Edit link
            {/* <span className="sr-only">Edit link</span> */}
            {/* <DefaultIcon /> */}
          </button>
        }
        links={getLinks(data)}
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
                value={getViewMore(data)}
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
    </>
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
        onChangeBlock={onChangeBlock}
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
