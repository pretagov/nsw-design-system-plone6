import React from 'react';

const CalloutView = ({ data }) => {
  let nswContents = data?.title
    ? `<h4 className="nsw-callout__title">${data.title}</h4>`
    : null;

  if (!nswContents) {
    return null;
  }

  if (data?.contents) {
    nswContents = nswContents.concat(data.contents.data);
  }

  return (
    <div className="nsw-callout">
      {data?.icon ? (
        <img
          src={`data:${data.icon['content-type']};base64,${data.icon.data}`}
          alt=""
        />
      ) : null}
      <div
        className="nsw-callout__content"
        dangerouslySetInnerHTML={{ __html: nswContents }}
      />
    </div>
  );
};

export { CalloutView };
export default CalloutView;
