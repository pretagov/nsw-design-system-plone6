import { Icon } from '@plone/volto/components';
import { installEditorPlugins } from 'nsw-design-system-plone6/editor';

import iconSVG from '@plone/volto/icons/text.svg';

export const updateTextEditorConfig = (config) => {
  config.settings.slate.styleMenu.blockStyles = [
    ...config.settings.slate.styleMenu.blockStyles,
    {
      cssClass: 'nsw-intro',
      label: 'Intro text',
    },
    {
      cssClass: 'nsw-small',
      label: 'Small text',
    },
  ];
  // installEditorPlugins(config);
};

export default updateTextEditorConfig;
