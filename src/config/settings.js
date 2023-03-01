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

  config.settings.showTags = false
};

export default updateSettingsConfig;
