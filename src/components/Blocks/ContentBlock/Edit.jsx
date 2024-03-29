import { WysiwygWidget } from '@plone/volto/components';
import TextLineEdit from '@plone/volto/components/manage/TextLineEdit/TextLineEdit';
import { ContentBlock } from 'nsw-design-system-plone6/components/Components/ContentBlock';
import { useEffect, useState } from 'react';
import { getLinks, getViewMore } from './helpers';

// ImageUpload
import { createContent } from '@plone/volto/actions';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';
import { ImagePickerWidget } from 'nsw-design-system-plone6/components/Widgets';
import { readAsDataURL } from 'promise-file-reader';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

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
    const imgSrc = flattenToAppURL(contentCreationAction?.data?.['@id']);
    // Prevents the block update or re-uploading causing a loop
    if (contentCreationAction?.data && data.image !== imgSrc) {
      onChangeBlock(id, {
        ...data,
        image: imgSrc,
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
      <ContentBlock
        data={data}
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
            selected={false}
            onFocus={() => {}}
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
            <ImagePickerWidget
              image={data.image ? `${data.image}/@@images/image` : null}
              className="nsw-content-block__image"
              onChange={imageUpload}
              blockSelected={props.selected}
              columns={props.columns}
            />
          ) : null
        }
        viewMoreUrl={
          <button
            className="nsw-content-block__link"
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          >
            View more <span className="sr-only">: click to edit</span>
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
                    url: value,
                  });
                }}
              />
            </div>
          </Segment.Group>
          <ObjectBrowserBody
            data={data}
            block={id}
            dataName={'url'}
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

export function ContentBlockEdit({
  data,
  onChangeBlock,
  block,
  selected,
  ...props
}) {
  return (
    <ContentBlockEditDisplay
      {...props}
      data={data}
      id={block}
      onChangeBlock={onChangeBlock}
    />
  );
}
