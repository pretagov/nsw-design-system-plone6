export const getHref = (data) =>
  typeof data.url === 'string'
    ? data.url
    : data.url?.[0]?.['@id'] || data['@id'] || '';
