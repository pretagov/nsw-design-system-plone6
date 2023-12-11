import config from '@plone/volto/registry';

export const sectionFields = [
  'sectionType',
  'sectionspacing',
  'sectionimage',
  'sectioncolour',
  'sectioninvert',
];

export function getSectionColour(data) {
  if (!data) {
    return undefined;
  }
  // TODO: Remove backwards compatibility with section blocks
  let colour = data.colour;
  if (data.sectionType && data.sectionType.startsWith('colour-')) {
    colour = data.sectionType.replace('colour-', '');
  }
  return colour;
}

export function blockNeedsSection(blockData) {
  // We don't want to double up on sections.
  if (blockData['@type'] === 'nsw_section') {
    return false;
  }
  if (blockData.sectionType) {
    return true;
  }
  // The value is an empty string if we had a value in the past but set it back to no section
  if (blockData.sectionType === '') {
    return false;
  }
  if (Object.keys(blockData).some((r) => sectionFields.includes(r))) {
    return true;
  }
  return false;
}

export function blocksNeedSections(blocksData) {
  if (typeof blocksData !== 'object') {
    return false;
  }
  // Need to check `blocksData` is actually an object here
  return Object.values(blocksData).some(
    (blockData) =>
      blockNeedsSection(blockData) ||
      config.settings.fullWidthBlockTypes.includes(blockData['@type']),
  );
}
