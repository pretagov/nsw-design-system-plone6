import { GridColumnsWidget } from 'nsw-design-system-plone6/components/Widgets/GridColumnsWidget';
import ImageWidget from 'nsw-design-system-plone6/components/Widgets/ImageWidget';
import { IconPickerWidget } from '../components/Widgets';

export const widgetMapping = {
  widget: {
    grid_columns_widget: GridColumnsWidget,
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
