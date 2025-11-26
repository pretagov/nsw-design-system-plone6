import { DefaultImage } from 'nsw-design-system-plone6/components/Components/Card';

import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  addImage: {
    id: 'Add image',
    defaultMessage: 'Add image',
  },
});

const columnsImageSizeMapping = {
  1: 'great',
  2: 'teaser',
  3: 'preview',
  4: 'preview',
};

export function ImagePickerWidget({
  image,
  className,
  onChange,
  blockSelected,
  columns,
}) {
  const intl = useIntl();

  function handleClick(event) {
    if (blockSelected === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  const columnsMapping = columnsImageSizeMapping[columns];
  const imageString = columnsMapping
    ? `${image}/${columnsImageSizeMapping[columns]}`
    : image;

  return (
    <>
      {/* TODO: Card edit block image field styling is all inline */}
      <div className="widget image-picker-widget">
        <label style={{ width: '100%' }}>
          <span className="sr-only">
            {intl.formatMessage(messages.addImage)}
          </span>
          {image ? (
            <div className={className}>
              <img src={imageString} alt="" />
            </div>
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
