import { IconPickerWidget } from '../components/Widgets';

export const widgetMapping = {
  widget: {
    icon: IconPickerWidget,
  },
};

export const updateWidgetsConfig = (config) => {
  Object.keys(widgetMapping).forEach((mappingKey) => {
    config.widgets[mappingKey] = {
      ...config.widgets[mappingKey],
      ...widgetMapping[mappingKey],
    };
  });
};

export default updateWidgetsConfig;
