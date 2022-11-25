import { ConditionalLink } from '@plone/volto/components';
import config from '@plone/volto/registry';
import cx from 'classnames';
import React from 'react';
import { useCookies } from 'react-cookie';

// TODO: Customisable datetime format
const ListItemsTemplate = ({ items, isEditMode, ...data }) => {
  const [cookies] = useCookies();
  const currentLanguage =
    cookies['I18N_LANGUAGE'] || config.settings.defaultLanguage;
  const dateTimeFormat = new Intl.DateTimeFormat(currentLanguage, {
    style: 'long',
  });
  return (
    <div className="nsw-list-items">
      {items.map((item) => {
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
                  {data.showDate
                    ? dateTimeFormat.format(new Date(item[data.dateField]))
                    : null}
                </div>
              ) : null}

              {!data.showDescription ? null : (
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
            {data.imagePosition !== 'hidden' ? (
              <div class="nsw-list-item__image">
                <img src="https://picsum.photos/id/3/400/200" alt="" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ListItemsTemplate;
