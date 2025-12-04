import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import { FormattedMessage } from 'react-intl';
import { Message } from 'semantic-ui-react';

import { Media } from 'nsw-design-system-plone6/components/Components/Media';

const Body = ({ data, isEditMode, isSelectedInEditMode }) => {
  let placeholder = data.preview_image
    ? isInternalURL(data.preview_image)
      ? `${flattenToAppURL(data.preview_image)}/@@images/image/large`
      : data.preview_image
    : null;

  let videoID = null;
  let listID = null;

  // Work out the placeholder URL
  if (data.url) {
    if (data.url.match('youtu')) {
      if (data.url.match('list')) {
        const matches = data.url.match(/^.*\?list=(.*)|^.*&list=(.*)$/);
        listID = matches[1] || matches[2];
      } else if (data.url.match('youtube.com/embed')) {
        videoID = data.url.match('youtube.com/embed/(.*)')[1];
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

  // Work out the source URL
  let url = '';
  if (data.url) {
    if (data.url.match('youtu')) {
      if (data.url.match('list')) {
        url = `https://www.youtube.com/embed/videoseries?list=${listID}`;
      } else {
        url = `https://www.youtube.com/embed/${videoID}`;
      }
    } else if (data.url.match('vimeo')) {
      url = `https://player.vimeo.com/video/${videoID}?api=false&amp;autoplay=false&amp;byline=false&amp;portrait=false&amp;title=false`;
    } else if (data.url.match('.mp4')) {
      url = isInternalURL(data.url)
        ? data.url.includes('@@download')
          ? data.url
          : `${flattenToAppURL(data.url)}/@@download/file`
        : data.url;
    }
  }

  if (!url) {
    return isEditMode ? (
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
    );
  }

  if (isEditMode && !isSelectedInEditMode) {
    return placeholder ? (
      <img className="placeholder" src={placeholder} alt={data.alt} />
    ) : (
      <div inert>
        <Media {...data} src={url} placeholder={placeholder} title={data.alt} />
      </div>
    );
  }

  return (
    <Media {...data} src={url} placeholder={placeholder} title={data.alt} />
  );
};

export default Body;
