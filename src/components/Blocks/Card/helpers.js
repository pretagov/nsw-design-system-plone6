export const getHref = (data) =>
  typeof data.link === 'string'
    ? data.link
    : data.link?.[0]?.['@id'] || data['@id'] || '';
