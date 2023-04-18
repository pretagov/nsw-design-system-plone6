export const updateSettingsConfig = (config) => {
  config.settings.navDepth = 2;
  config.experimental.addBlockButton.enabled = true;

  config.settings.fullWidthBlockTypes = [
    'hero',
    'nsw_section',
    'nsw_inPageAlert',
    'nsw_announcementBar',
    'form',
    ...(config.settings.fullWidthBlockTypes || []),
  ];

  config.settings.showTags = false;
  config.settings.showSelfRegistration =
    process?.env?.['RAZZLE_ENABLE_SELF_REGISTRATION'] === 'true' ||
    (typeof window !== 'undefined' &&
      window.env['RAZZLE_ENABLE_SELF_REGISTRATION'] === 'true');
};

export default updateSettingsConfig;
