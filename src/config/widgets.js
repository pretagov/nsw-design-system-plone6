import { IconPickerWidget } from '../components/Widgets';
import { GridColumnsWidget } from 'nsw-design-system-plone6/components/Widgets/GridColumnsWidget';

export const widgetMapping = {
  widget: {
    icon: IconPickerWidget,
    grid_columns_widget: GridColumnsWidget,
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
