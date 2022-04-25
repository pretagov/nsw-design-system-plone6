import React from 'react';

// TODO: Allow adding alt text to images
const ContentBlockView = ({ data, isEditMode }) => {
  return (
    <div className="nsw-content-block__content">
      {data?.image ? (
        <div className="nsw-content-block__image">
          {data.imageIsIcon ? (
            <div className="nsw-content-block__icon">
              <img
                src={`data:${data.image['content-type']};base64,${data.image.data}`}
                alt=""
              />
            </div>
          ) : (
            <img
              src={`data:${data.image['content-type']};base64,${data.image.data}`}
              alt=""
            />
          )}
        </div>
      ) : null}
      <div className="nsw-content-block__title">{data.title}</div>
      <p className="nsw-content-block__copy">{data.copy}</p>
      {data?.links ? (
        <ul className="nsw-content-block__list">
          {data.links.map((item) => {
            if (!item.link || !item.link[0]) {
              return null;
            }
            const url = item.link[0].getURL;
            return (
              <li key={url}>
                <a href={url}>{item.title}</a>
              </li>
            );
          })}
        </ul>
      ) : null}
      {data?.viewMore ? (
        <div className="nsw-content-block__link">
          <a href={data.viewMore[0].getURL}>View more</a>
        </div>
      ) : null}
    </div>
  );
};

export default ContentBlockView;
