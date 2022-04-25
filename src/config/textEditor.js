import Icon from '@plone/volto/components/theme/Icon/Icon';
import radiodisabledSVG from '@plone/volto/icons/radio-disabled.svg';
import createInlineStyleButton from 'draft-js-buttons/lib/utils/createInlineStyleButton';
import React from 'react';

const TextIntroButton = createInlineStyleButton({
  style: 'NSW_INTRO',
  children: <Icon name={radiodisabledSVG} size="24px" />,
});

const customRenderers = {
  NSW_INTRO: (children, { key }) => (
    <p key={key} className="nsw-intro">
      {children}
    </p>
  ),
};

const toolbarButtons = [TextIntroButton];

export const updateTextEditorConfig = (config) => {
  const { richtextEditorSettings } = config.settings;
  config.settings.richtextEditorSettings = (props) => {
    const result = richtextEditorSettings(props);
    let updatedButtons = result.richTextEditorInlineToolbarButtons;
    // Add custom buttons at the 2nd position
    toolbarButtons.forEach((button) => {
      updatedButtons.splice(2, 0, button);
    });
    result.richTextEditorInlineToolbarButtons = updatedButtons;
    return result;
  };

  config.settings = {
    ...config.settings,
    richtextViewSettings: {
      ...config.settings.richtextViewSettings,
      ToHTMLRenderers: {
        ...config.settings.richtextViewSettings.ToHTMLRenderers,
        inline: {
          ...config.settings.richtextViewSettings.ToHTMLRenderers.inline,
          ...customRenderers,
        },
      },
    },
  };
};

export default updateTextEditorConfig;
