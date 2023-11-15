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
  config.settings['volto-blocks-footer'].slots = {
    ...config.settings['volto-blocks-footer'].slots,
    footer: {
      title: 'Footer',
    },
    testing: {
      title: 'Test slot',
    },
  };
};

export default updateSettingsConfig;
