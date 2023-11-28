import { NSW_INTRO } from 'nsw-design-system-plone6/editor/IntroText/constants';

export const withPlugin = (editor) => {
  const { normalizeNode, isInline } = editor; // we can also normalize plugin data here

  editor.isInline = (element) => {
    return element.type === NSW_INTRO ? true : isInline(element);
  };

  return editor;
};
