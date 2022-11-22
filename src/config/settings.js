export const updateSettingsConfig = (config) => {
  config.settings.navDepth = 2;

  config.settings.fullWidthBlockTypes = [
    'hero',
    'nsw_section',
    'nsw_inPageAlert',
    'nsw_announcementBar',
    'form',
    ...(config.settings.fullWidthBlockTypes || []),
  ];
};

export default updateSettingsConfig;
