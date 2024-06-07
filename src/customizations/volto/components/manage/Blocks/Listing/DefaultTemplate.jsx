import { ConditionalLink, FormattedDate } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import cx from 'classnames';

// TODO: Customisable datetime format
const ListItemsTemplate = ({ items, isEditMode, ...data }) => {
  return (
    <div className="nsw-list-items">
      {items.map((item) => {
        const image =
          data.imagePosition !== 'hidden' && item.image_field
            ? `${flattenToAppURL(item['@id'])}/@@images/${
                item.image_field
              }/teaser`
            : null;
        const dateFieldValue =
          item[data.dateField] === 'None' ? null : item?.[data.dateField];
        // Check the field is actually a date
        const date = ['Invalid Date', NaN].includes(new Date(dateFieldValue))
          ? null
          : dateFieldValue;
        const label =
          item[data.labelField] === 'None' ? null : item[data.labelField?.value];
        const tags = [];
        data.tagField?.forEach((field) => {
          let fieldValue = item[field.value];
          if (!fieldValue || fieldValue === 'None') {
            return null;
          }
          tags.push(...item[field.value]);
        });
        return (
          <div
            key={item['@id']}
            className={cx('nsw-list-item', {
              'nsw-list-item--block': data.clickableArea === 'block',
              'nsw-list-item--reversed': data.imagePosition === 'left', // This is how the NSW Design System docs recommend it is done, but this should be done in HTML
            })}
          >
            <div className="nsw-list-item__content">

              {data.showLabel ? (
                  <div className="nsw-list-item__label">{label}</div>
              ) : null}

              {data.showDate ? (
                <div className="nsw-list-item__info">
                  {data.showDate && date ? (
                    <FormattedDate date={date} format={{ dateStyle: 'long' }} locale="en-au" />
                  ) : null}
                </div>
              ) : null}

              <div className="nsw-list-item__title">
                <ConditionalLink item={item} condition={!isEditMode}>
                  {item.title ? item.title : item['@id']}
                </ConditionalLink>
              </div>

              {data.showUrl ? (
                <div className="nsw-list-item__info">
                  {data.showUrl ? item.getURL : null}
                </div>
              ) : null}

              {!data.showDescription && item.description ? null : (
                <div
                  className="nsw-list-item__copy"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}

              {data.showTags && tags?.length > 0 ? (
                <div className="nsw-list-item__tags">
                  <div className="nsw-list nsw-list--8">
                    {tags.map((tagText, index) => {
                      return (
                        <span key={index} className="nsw-tag">
                          {tagText}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            {data.imagePosition !== 'hidden' && image ? (
              <div className="nsw-list-item__image">
                <img src={image} alt="" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ListItemsTemplate;
