export function getTitleForFacet(facet, fallback = '') {
  return facet.title || facet.field?.label || fallback;
}
