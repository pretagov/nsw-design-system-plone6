import { defineMessages } from 'react-intl';
const messages = defineMessages({
  sidebarPosition: {
    id: 'Sidebar position',
    defaultMessage: 'Sidebar position',
  },
});

export const SidebarSchema = ({ intl }) => {
  return {
    required: [],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['sidebarPosition'],
      },
    ],
    properties: {
      sidebarPosition: {
        title: intl.formatMessage(messages.sidebarPosition),
        type: 'string',
        factory: 'Choice',
        default: 'left',
        choices: [
          ['left', 'Left'],
          ['right', 'Right'],
        ],
      },
    },
  };
};

export default SidebarSchema;
