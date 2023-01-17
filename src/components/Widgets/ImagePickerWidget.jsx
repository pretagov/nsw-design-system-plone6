import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';

import { Icon } from '@plone/volto/components';
import clearSVG from '@plone/volto/icons/clear.svg';
import configSVG from '@plone/volto/icons/configuration.svg';
import { Button } from 'semantic-ui-react';

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
      // TODO: Card edit block image field styling is all inline
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
