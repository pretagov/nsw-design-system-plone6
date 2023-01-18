import { DefaultImage } from 'nsw-design-system-plone6/components/Components/Card';

import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  addImage: {
    id: 'Add image',
    defaultMessage: 'Add image',
  },
});

export function ImagePickerWidget({ onChange, blockSelected }) {
  const intl = useIntl();

  return (
    <>
      {/* TODO: Card edit block image field styling is all inline */}
      <div className="widget image-picker-widget">
        <label style={{ width: '100%' }}>
          <span className="sr-only">
            {intl.formatMessage(messages.addImage)}
          </span>
          <DefaultImage />
          <input type="file" onChange={onChange} style={{ display: 'none' }} />
        </label>
      </div>
    </>
  );
}
