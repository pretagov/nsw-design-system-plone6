import { DefaultImage } from 'nsw-design-system-plone6/components/Components/Card';

import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  addImage: {
    id: 'Add image',
    defaultMessage: 'Add image',
  },
});

export function ImagePickerWidget({
  image,
  className,
  onChange,
  blockSelected,
}) {
  const intl = useIntl();

  function handleClick(event) {
    if (blockSelected === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  return (
    <>
      {/* TODO: Card edit block image field styling is all inline */}
      <div className="widget image-picker-widget">
        <label style={{ width: '100%' }}>
          <span className="sr-only">
            {intl.formatMessage(messages.addImage)}
          </span>
          {image ? (
            <img className={className} src={image} alt="" />
          ) : (
            <DefaultImage />
          )}
          <input
            type="file"
            onClick={handleClick}
            onChange={onChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </>
  );
}
