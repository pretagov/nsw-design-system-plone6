import { NSW_SMALL } from 'nsw-design-system-plone6/editor/SmallText/constants';

export const withNswSmallText = (editor) => {
  const { normalizeNode, isInline } = editor; // we can also normalize plugin data here

  editor.isInline = (element) => {
    return element.type === NSW_SMALL ? true : isInline(element);
  };

  return editor;
};
