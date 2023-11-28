import { BlockButton } from '@plone/volto-slate/editor/ui';
import { Element } from 'nsw-design-system-plone6/editor/SmallText/Element';
import { ELEMENT_ID } from 'nsw-design-system-plone6/editor/SmallText/constants';

import { messages } from 'nsw-design-system-plone6/editor/SmallText/constants';
import { useIntl } from 'react-intl';

import iconSVG from '@plone/volto/icons/subtext.svg';

function ElementButton({ config, ...props }) {
  const intl = useIntl();
  return (
    <BlockButton
      format={ELEMENT_ID}
      icon={iconSVG}
      title={intl.formatMessage(messages.blockTitle)}
    />
  );
}

export function installSmallText(config) {
  // Documented way used in the commented code below crashes if you don't provide
  //   it a form. Not sure why
  // import { makeInlineElementPlugin } from '@plone/volto-slate/elementEditor';
  // import { withNswSmallText } from 'nsw-design-system-plone6/editor/SmallText/extension';
  // const opts = {
  //   title: {intl.formatMessage(messages.blockTitle)},
  //   pluginId: ELEMENT_ID,
  //   elementType: ELEMENT_ID,
  //   element: Element,
  //   isInlineElement: true,
  //   extensions: [withTooltip],
  //   toolbarButtonIcon: descriptionSVG,
  //   messages,
  // };
  // const [installEditor] = makeInlineElementPlugin(opts);
  // config = installEditor(config);

  const { slate } = config.settings;
  slate.elements[ELEMENT_ID] = Element;
  slate.buttons[ELEMENT_ID] = ElementButton;
  slate.toolbarButtons = [...(slate.toolbarButtons || []), ELEMENT_ID];
  slate.expandedToolbarButtons = [
    ...(slate.expandedToolbarButtons || []),
    ELEMENT_ID,
  ];

  return config;
}
