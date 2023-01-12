import { ConditionalLink, FormattedDate } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';
import { useCookies } from 'react-cookie';

// TODO: Customisable datetime format
const ListItemsTemplate = ({ items, isEditMode, ...data }) => {
  const [cookies] = useCookies();
  const currentLanguage =
    cookies['I18N_LANGUAGE'] || config.settings.defaultLanguage;
  const dateTimeFormat = new Intl.DateTimeFormat(currentLanguage, {
    style: 'long',
  });
  console.log('showDescription', data.showDescription);
  return (
    <div className="nsw-list-items">
      {items.map((item) => {
        const image =
          data.imagePosition !== 'hidden' && item.image_field
            ? `${flattenToAppURL(item['@id'])}/@@images/${
                item.image_field
              }/teaser`
            : null;
        const date =
          item[data.dateField] === 'None' ? null : item[data.dateField];
        return (
          <div
            key={item['@id']}
            className={cx('nsw-list-item', {
              'nsw-list-item--block': data.clickableArea === 'block',
              'nsw-list-item--reversed': data.imagePosition === 'left', // This is how the NSW Design System docs recommend it is done, but this should be done in HTML
            })}
          >
            <div className="nsw-list-item__content">
              {/* TODO: Find a way to allow adjustable labels */}
              {/* <div className="nsw-list-item__label">Stories</div> */}
              <div className="nsw-list-item__title">
                <ConditionalLink item={item} condition={!isEditMode}>
                  {item.title ? item.title : item.id}
                </ConditionalLink>
              </div>
              {data.showUrl || data.showDate ? (
                <div class="nsw-list-item__info">
                  {data.showUrl ? item.getURL : null}
                  {data.showDate && date ? (
                    <FormattedDate date={date} locale="en-au" />
                  ) : null}
                </div>
              ) : null}

              {!data.showDescription && item.description ? null : (
                <div className="nsw-list-item__copy">{item.description}</div>
              )}
              {data.showTags && item.Subject?.length > 0 ? (
                <div className="nsw-list-item__tags">
                  <div className="nsw-list nsw-list--8">
                    {item.Subject.map((tagText) => {
                      return (
                        <span key={tagText} className="nsw-tag">
                          {tagText}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            {data.imagePosition !== 'hidden' && image ? (
              <div class="nsw-list-item__image">
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
