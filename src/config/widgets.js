import { IconPickerWidget } from '../components/Widgets';
import ImageWidget from 'nsw-design-system-plone6/components/Widgets/ImageWidget';

export const widgetMapping = {
  widget: {
    icon: IconPickerWidget,
    image: ImageWidget,
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
