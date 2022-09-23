import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import cx from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Message } from 'semantic-ui-react';

const Body = ({ data, isEditMode }) => {
  let placeholder = data.preview_image
    ? isInternalURL(data.preview_image)
      ? `${flattenToAppURL(data.preview_image)}/@@images/image`
      : data.preview_image
    : null;

  let videoID = null;
  let listID = null;

  if (data.url) {
    if (data.url.match('youtu')) {
      if (data.url.match('list')) {
        const matches = data.url.match(/^.*\?list=(.*)|^.*&list=(.*)$/);
        listID = matches[1] || matches[2];
      } else {
        videoID = data.url.match(/.be\//)
          ? data.url.match(/^.*\.be\/(.*)/)[1]
          : data.url.match(/^.*\?v=(.*)$/)[1];
      }

      if (!placeholder) {
        //load video preview image from youtube
        placeholder =
          'https://img.youtube.com/vi/' + videoID + '/sddefault.jpg';
      }
    } else if (data.url.match('vimeo')) {
      videoID = data.url.match(/^.*\.com\/(.*)/)[1];
      if (!placeholder) {
        placeholder = 'https://vumbnail.com/' + videoID + '.jpg';
      }
    }
  }

  const ref = React.createRef();
  const onKeyDown = (e) => {
    if (e.nativeEvent.keyCode === 13) {
      ref.current.handleClick();
    }
  };

  const embedSettings = {
    placeholder: placeholder,
    icon: 'play',
    defaultActive: false,
    autoplay: false,
    aspectRatio: '16:9',
    tabIndex: 0,
    onKeyPress: onKeyDown,
    ref: ref,
  };

  return (
    <figure
      className={cx('nsw-media', {
        [`nsw-media--${data.captionBackgroundColour}`]: !!data.captionBackgroundColour,
        [`nsw-media--${data.size}`]:
          !!data.size &&
          !['left', 'right'].includes(data.align) &&
          data.size !== 'fullWidth',
        [`nsw-media--${data.align}-${data.size}`]:
          !!data.size && !!data.align && data.size !== 'fullWidth',
      })}
    >
      <div className="nsw-media__video">
        {data.url ? (
          <>
            {data.url.match('youtu') ? (
              <>
                {data.url.match('list') ? (
                  <iframe
                    src={`https://www.youtube.com/embed/videoseries?list=${listID}`}
                    title="Digital.nsw launch with Victor Dominello MP at NSW Parliament House"
                    style={{ border: 0 }}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoID}`}
                      title="Digital.nsw launch with Victor Dominello MP at NSW Parliament House"
                      style={{ border: 0 }}
                      allowFullScreen
                    ></iframe>
                  </>
                )}
              </>
            ) : (
              <>
                {data.url.match('vimeo') ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${videoID}?api=false&amp;autoplay=false&amp;byline=false&amp;portrait=false&amp;title=false`}
                    title="Digital.nsw launch with Victor Dominello MP at NSW Parliament House"
                    style={{ border: 0 }}
                    allowFullScreen
                  ></iframe>
                ) : (
                  //
                  // <Embed id={videoID} source="vimeo" {...embedSettings} />
                  <>
                    {data.url.match('.mp4') ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video
                        // Style tag is needed for sizing. See https://github.com/digitalnsw/nsw-design-system/pull/252
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100$',
                          height: '100%',
                        }}
                        src={
                          isInternalURL(data.url)
                            ? data.url.includes('@@download')
                              ? data.url
                              : `${flattenToAppURL(data.url)}/@@download/file`
                            : data.url
                        }
                        controls
                        poster={placeholder}
                        type="video/mp4"
                      />
                    ) : isEditMode ? (
                      <div>
                        <Message>
                          <center>
                            <FormattedMessage
                              id="Please enter a valid URL by deleting the block and adding a new video block."
                              defaultMessage="Please enter a valid URL by deleting the block and adding a new video block."
                            />
                          </center>
                        </Message>
                      </div>
                    ) : (
                      <div className="invalidVideoFormat" />
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : null}
      </div>
      {data.caption ? <figcaption>{data.caption}</figcaption> : null}
    </figure>
  );
};

export default Body;
