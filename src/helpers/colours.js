const coloursWithWhiteText = [
  'brand-dark',
  'brand-supplementary',
  'brand-accent',
  'black',
  'grey-01',
  'grey-02',
  'info-dark',
  'success-dark',
  'warning-dark',
  'error-dark',
  'green-01',
  'teal-01',
  'teal-02',
  'blue-01',
  'blue-02',
  'purple-01',
  'purple-02',
  'fuchsia-01',
  'fuchsia-02',
  'pink-01',
  'pink-02',
  'red-01',
  'red-02',
  'orange-01',
  'yellow-01',
  'brown-01',
];

export function getTextColourUtilityForPaletteName(paletteName) {
  if (!paletteName) {
    return undefined;
  }
  if (coloursWithWhiteText.includes(paletteName)) {
    return 'nsw-text--white';
  }
  return 'nsw-text--black';
}
