import { Select } from 'nsw-design-system-plone6/components/Components/Form/Select';

export function GoogleTranslateWidget(props) {
  return (
    <>
      <label
        className="sr-only"
        htmlFor="field-google-translate-language-select"
      >
        Select a language
      </label>
      <Select {...props} />
    </>
  );
}
