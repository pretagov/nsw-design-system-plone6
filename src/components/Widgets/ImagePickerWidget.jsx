import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';

import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  addImage: {
    id: 'Add image',
    defaultMessage: 'Add image',
  },
});

export function ImagePickerWidget({ onChange }) {
  const intl = useIntl();

  return (
    <>
      {/* TODO: Card edit block image field styling is all inline */}
      <div style={{ marginInline: 'auto', paddingBlockEnd: '6px' }}>
        <label style={{ width: '100%' }}>
          <img style={{ display: 'block' }} src={imageBlockSVG} alt="" />
          <span className="nsw-button nsw-button--dark">
            {intl.formatMessage(messages.addImage)}
          </span>
          <input type="file" onChange={onChange} style={{ display: 'none' }} />
        </label>
      </div>
    </>
  );
}
