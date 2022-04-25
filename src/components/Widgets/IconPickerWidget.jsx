import { FormFieldWrapper } from '@plone/volto/components';
import { map } from 'lodash';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Dropdown } from 'semantic-ui-react';

const messages = defineMessages({
  selectAnIcon: {
    id: 'Select an icon',
    defaultMessage: 'Select an icon',
  },
});

const iconOptions = [
  {
    key: 'Info',
    text: 'Info',
    value: 'info',
    // image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
  },
  {
    key: 'Warning',
    text: 'Warning',
    value: 'error',
    // image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
  },
  {
    key: 'Error',
    text: 'Error',
    value: 'cancel',
    // image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
  },
  {
    key: 'Success',
    text: 'Success',
    value: 'check_circle',
    // image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
  },
];

const IconPickerWidget = ({
  id,
  title,
  required,
  description,
  error,
  value,
  onChange,
  onEdit,
  onDelete,
  ...props
}) => {
  const intl = useIntl();

  const handleChange = (event, dropdownData) => {
    onChange(id, value === '' ? undefined : dropdownData.value);
  };

  return (
    <FormFieldWrapper id={id} title={title} {...props}>
      <Dropdown
        value={value}
        onChange={handleChange}
        placeholder={intl.formatMessage(messages.selectAnIcon)}
        fluid
        selection
        options={iconOptions}
      />
    </FormFieldWrapper>
  );
};

export default IconPickerWidget;
