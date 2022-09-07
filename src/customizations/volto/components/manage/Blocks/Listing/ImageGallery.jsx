import { ConditionalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import React from 'react';

const ListItemsTemplate = ({ items, isEditMode, imagePosition }) => {
  debugger;
  return (
    <div className="nsw-list-items">
      {items.map((item) => {
        return (
          <div key={item['@id']} className="nsw-list-item nsw-list-item--block">
            {imagePosition === 'right' ? (
              <>
                <div className="nsw-list-item__content">
                  {/* TODO: Find a way to allow adjustable labels */}
                  {/* <div className="nsw-list-item__label">Stories</div> */}
                  <div className="nsw-list-item__title">
                    <ConditionalLink item={item} condition={!isEditMode}>
                      {item.title ? item.title : item.id}
                    </ConditionalLink>
                  </div>
                  <div className="nsw-list-item__copy">{item.description}</div>
                  {item.Subject ? (
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
                <div className="nsw-list-item__image">
                  <img
                    src={`${flattenToAppURL(item['@id'])}/@@images/${
                      item.image_field
                    }/thumb`}
                    alt=""
                  />
                </div>
              </>
            ) : (
              <>
                <div className="nsw-list-item__image">
                  <img
                    src={`${flattenToAppURL(item['@id'])}/@@images/${
                      item.image_field
                    }/thumb`}
                    alt=""
                  />
                </div>
                <div className="nsw-list-item__content">
                  {/* TODO: Find a way to allow adjustable labels */}
                  {/* <div className="nsw-list-item__label">Stories</div> */}
                  <div className="nsw-list-item__title">
                    <ConditionalLink item={item} condition={!isEditMode}>
                      {item.title ? item.title : item.id}
                    </ConditionalLink>
                  </div>
                  <div className="nsw-list-item__copy">{item.description}</div>
                  {item.Subject ? (
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
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListItemsTemplate;
