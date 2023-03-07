export const getHref = (data) => {
  if (data.url) {
    return typeof data.url === 'string'
      ? data.url
      : data.url?.[0]?.['@id'] || data['@id'] || '';
  } else if (data.url) {
    return typeof data.url === 'string'
      ? data.url
      : data.url?.[0]?.['@id'] || data['@id'] || '';
  } else return null;
};
