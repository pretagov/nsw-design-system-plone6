import { defineMessages } from 'react-intl';

const messages = defineMessages({
  body: {
    id: 'Body',
    defaultMessage: 'Body',
  },
  icon: {
    id: 'Icon',
    defaultMessage: 'Icon',
  },
  isCompact: {
    id: 'Make compact',
    defaultMessage: 'Make compact',
  },
  includeMargin: {
    id: 'Include margin',
    defaultMessage: 'Include margin',
  },
  alertType: {
    id: 'Alert type',
    defaultMessage: 'Alert type',
  },
});

export const inPageAlertSchema = ({ intl }) => {
  return {
    required: ['body'],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['body', 'alertType', 'isCompact', 'includeMargin'],
        required: ['alertType'],
      },
    ],
    properties: {
      body: {
        title: intl.formatMessage(messages.body),
        type: 'string',
        widget: 'richtext',
      },
      icon: {
        title: intl.formatMessage(messages.icon),
        widget: 'icon',
        mode: 'image',
      },
      isCompact: {
        title: intl.formatMessage(messages.isCompact),
        type: 'boolean',
        default: false,
      },
      alertType: {
        title: intl.formatMessage(messages.alertType),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['info', 'Information'],
          ['success', 'Success'],
          ['warning', 'Warning'],
          ['error', 'Critical'],
        ],
        default: 'info',
      },
    },
  };
};

export default inPageAlertSchema;
