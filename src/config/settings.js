export const updateSettingsConfig = (config) => {
  config.settings.navDepth = 2;
  config.experimental.addBlockButton.enabled = true;

  config.settings.fullWidthContentBlocks = [
    ...(config.settings.fullWidthContentBlocks || []),
    'form',
  ];
  config.settings.fullWidthBlockTypes = [
    'hero',
    'nsw_section',
    'nsw_announcementBar',
    'form',
    'columnsBlock',
    ...(config.settings.fullWidthBlockTypes || []),
  ];

  config.settings.showTags = false;
  config.settings.showSelfRegistration =
    process?.env?.['RAZZLE_ENABLE_SELF_REGISTRATION'] === 'true' ||
    (typeof window !== 'undefined' &&
      window.env['RAZZLE_ENABLE_SELF_REGISTRATION'] === 'true');
  config.settings['volto-slots-editor'] = {
    // allowedBlocks: ['video'],
    showRestricted: true,
    slots: {
      ...config.settings['volto-slots-editor'].slots,
      aoc: {
        // TODO: i18n
        title: 'AOC',
        description: `Appears in between the lower and upper footer.
When enabled, the built-in AOC will be disabled.
      `,
      },
      beforeMasthead: {
        // TODO: i18n
        title: 'Before masthead',
        description: `Appears as the first contents on the page after the skiplinks.
      `,
      },
    }
  };
};

export default updateSettingsConfig;
