export function getSectionColour(data) {
  // TODO: Remove backwards compatibility with section blocks
  let colour = data.colour;
  if (data.sectionType && data.sectionType.startsWith('colour-')) {
    colour = data.sectionType.replace('colour-', '');
  }
  return colour;
}
