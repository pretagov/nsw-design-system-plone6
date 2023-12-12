import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { validations as validationObjects } from 'volto-form-block/helpers/validators';

import { MaybeWrap } from '@plone/volto/components';
import WysiwygWidget from '@plone/volto/components/manage/Widgets/WysiwygWidget';

import CheckboxListWidget from './Widget/CheckboxListWidget';
import CheckboxWidget from './Widget/CheckboxWidget';
import DatetimeWidget from './Widget/DatetimeWidget';
import EmailWidget from './Widget/EmailWidget';
import FileWidget from './Widget/FileWidget';
import RadioWidget from './Widget/RadioWidget';
import SelectWidget from './Widget/SelectWidget';
import TextareaWidget from './Widget/TextareaWidget';
import TextWidget from './Widget/TextWidget';

import { pick } from 'lodash';
import config from '@plone/volto/registry';
import parse from 'html-react-parser';

const messages = defineMessages({
  select_a_value: {
    id: 'form_select_a_value',
    defaultMessage: 'Select a value',
  },
});

const widgetMapping = {
  single_choice: RadioWidget,
  checkbox: CheckboxWidget,
};

/**
 * Field class.
 * @class View
 * @extends Component
 */
const Field = (props) => {
  const {
    label,
    description,
    name,
    field_type,
    required,
    input_values,
    onChange,
    isOnEdit,
    valid,
    disabled = false,
    formHasErrors = false,
    widget,
    shouldShow = true,
    display_values,
    validations,
  } = props;
  let { value } = props;
  // A value of `null` is a touched field with no value
  if (
    props.hasOwnProperty('default_value') &&
    value !== null &&
    value === undefined
  ) {
    value = props.default_value;
  }
  const intl = useIntl();

  const isInvalid = () => {
    let isInvalid = !isOnEdit && !valid;
    // TODO: Re-enable frontend-validations
    // if (validations && validations.length > 0) {
    //   validations.forEach((validation) => {
    //     const validatorObject = validationObjects[validation.validation_type];
    //     const validator = validatorObject?.validator;
    //     if (validator) {
    //       const validatorProperties = Object.keys(validatorObject.properties)
    //       isInvalid = !validator({
    //         value,
    //         ...pick(validation, validatorProperties),
    //       });
    //     }
    //   })
    // }

    return isInvalid;
  };

  if (widget) {
    const Widget = widgetMapping[widget];
    const valueList =
      field_type === 'yes_no'
        ? [
            {
              value: true,
              label:
                display_values &&
                typeof display_values === 'object' &&
                display_values.hasOwnProperty('yes')
                  ? display_values.yes
                  : 'Yes',
            },
            {
              value: false,
              label:
                display_values &&
                typeof display_values === 'object' &&
                display_values.hasOwnProperty('no')
                  ? display_values.no
                  : 'No',
            },
          ]
        : [...(input_values?.map((v) => ({ value: v, label: v })) ?? [])];

    return (
      <Widget
        {...props}
        id={name}
        title={label}
        value={value}
        valueList={valueList}
        invalid={isInvalid().toString()}
        {...(isInvalid() ? { className: 'is-invalid' } : {})}
      />
    );
  }

  return (
    <MaybeWrap condition={isOnEdit} as="div" inert={isOnEdit ? '' : null}>
      {field_type === 'text' && (
        <TextWidget
          id={name}
          name={name}
          title={label}
          description={description}
          required={required}
          onChange={onChange}
          value={value}
          isDisabled={disabled}
          invalid={isInvalid().toString()}
          {...(isInvalid() ? { className: 'is-invalid' } : {})}
          shouldShow={shouldShow}
        />
      )}
      {field_type === 'textarea' && (
        <TextareaWidget
          id={name}
          name={name}
          title={label}
          description={description}
          required={required}
          onChange={onChange}
          value={value}
          rows={10}
          isDisabled={disabled}
          invalid={isInvalid().toString()}
          {...(isInvalid() ? { className: 'is-invalid' } : {})}
        />
      )}
      {field_type === 'select' && (
        <SelectWidget
          id={name}
          name={name}
          title={label}
          description={description}
          getVocabulary={() => {}}
          getVocabularyTokenTitle={() => {}}
          choices={[...(input_values?.map((v) => [v, v]) ?? [])]}
          value={value}
          onChange={onChange}
          placeholder={intl.formatMessage(messages.select_a_value)}
          aria-label={intl.formatMessage(messages.select_a_value)}
          classNamePrefix="react-select"
          isDisabled={disabled}
          invalid={isInvalid().toString()}
          required={required}
          {...(isInvalid() ? { className: 'is-invalid' } : {})}
        />
      )}
      {field_type === 'single_choice' && (
        <RadioWidget
          id={name}
          title={label}
          description={description}
          required={required}
          onChange={onChange}
          valueList={[
            ...(input_values?.map((v) => ({ value: v, label: v })) ?? []),
          ]}
          value={value}
          isDisabled={disabled}
          invalid={isInvalid().toString()}
          {...(isInvalid() ? { className: 'is-invalid' } : {})}
        />
      )}
      {field_type === 'multiple_choice' && (
        <CheckboxListWidget
          id={name}
          name={name}
          title={label}
          description={description}
          required={required}
          onChange={onChange}
          valueList={[
            ...(input_values?.map((v) => ({ value: v, label: v })) ?? []),
          ]}
          value={value}
          isDisabled={disabled}
          invalid={isInvalid().toString()}
          {...(isInvalid() ? { className: 'is-invalid' } : {})}
        />
      )}
      {(field_type === 'yes_no' || field_type === 'checkbox') && (
        <CheckboxWidget
          id={name}
          name={name}
          title={label}
          description={description}
          required={required}
          onChange={onChange}
          value={!!value}
          isDisabled={disabled}
          invalid={isInvalid().toString()}
          {...(isInvalid() ? { className: 'is-invalid' } : {})}
        />
      )}
      {field_type === 'date' && (
        <DatetimeWidget
          id={name}
          name={name}
          title={label}
          description={description}
          dateOnly={true}
          noPastDates={false}
          resettable={false}
          onChange={onChange}
          value={value}
          isDisabled={disabled}
          required={required}
          invalid={isInvalid().toString()}
          {...(isInvalid() ? { className: 'is-invalid' } : {})}
        />
      )}
      {field_type === 'attachment' && (
        <FileWidget
          id={name}
          name={name}
          title={label}
          description={description}
          type="file"
          required={required}
          invalid={isInvalid().toString()}
          isDisabled={disabled}
          onChange={onChange}
          value={value}
          multiple={false}
        />
      )}
      {(field_type === 'from' || field_type === 'email') && (
        <EmailWidget
          id={name}
          name={name}
          title={label}
          description={description}
          required={required}
          onChange={onChange}
          value={value}
          isDisabled={disabled}
          invalid={isInvalid().toString()}
          {...(isInvalid() ? { className: 'is-invalid' } : {})}
        />
      )}
      {field_type === 'static_text' &&
        (isOnEdit ? (
          <WysiwygWidget
            wrapped={false}
            id={name}
            name={name}
            title={label}
            description={description}
            onChange={onChange}
            value={value}
          />
        ) : value?.data ? (
          parse(value.data)
        ) : (
          <br />
        ))}
      {config.blocks.blocksConfig.form.additionalFields?.reduce((acc, val) => {
        if (val.id === field_type)
          return [
            ...acc,
            <val.component
              id={name}
              name={name}
              title={label}
              description={description}
              required={required}
              onChange={onChange}
              value={value}
              isDisabled={disabled}
              formHasErrors={formHasErrors}
              invalid={isInvalid().toString()}
              {...(isInvalid() ? { className: 'is-invalid' } : {})}
            />,
          ];

        return acc;
      }, []) ?? []}
    </MaybeWrap>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Field.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  field_type: PropTypes.string,
  input_values: PropTypes.any,
  value: PropTypes.any,
  formHasErrors: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Field;
