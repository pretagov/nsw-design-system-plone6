export const getHref = (data) => {
  // debugger;
  if (data.url) {
    return typeof data.url === 'string' ? data.url : data.url;
    // : data.url?.[0]?.['@id'] || data['@id'] || '';
  } else if (data.link) {
    return typeof data.link === 'string'
      ? data.link
      : data.link?.[0]?.['@id'] || data['@id'] || '';
  } else return null;
};
