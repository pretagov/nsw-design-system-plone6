import cx from 'classnames';
import PropTypes from 'prop-types';

import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  no_value_selected_option: {
    id: 'Please select',
    defaultMessage: 'Please select',
  },
  required: {
    id: 'required',
    defaultMessage: 'required',
  },
  field_required: {
    id: 'This field is required',
    defaultMessage: 'This field is required',
  },
});

export function Select({
  options = [],
  noValueOption,
  value,
  id,
  title,
  description,
  required,
  onChange = (e) => {
    if (value) {
      console.warn('No on change for select', e.target);
    }
  },
  disabled,
  invalid,
}) {
  const intl = useIntl();
  let attributes = {};

  if (required) {
    attributes.required = true;
    attributes['aria-required'] = true;
  }
  const isInvalid = invalid === true || invalid === 'true';
  if (isInvalid) {
    attributes['aria-invalid'] = true;
  }

  const inputId = `field-${id}`;

  let showNoValueOption = false;
  if (!typeof noValueOption === 'object') {
    showNoValueOption = true;
  } else if (!required && noValueOption !== false) {
    showNoValueOption = true;
  }

  return (
    <div className="nsw-form__group">
      {title !== false ? (
        <label
          className={cx('nsw-form__label', { 'nsw-form__required': required })}
          htmlFor={inputId}
        >
          {title}
          {required ? (
            <span className="sr-only">
              {' '}
              ({intl.formatMessage(messages.required)})
            </span>
          ) : null}
        </label>
      ) : null}
      {description ? (
        <span className="nsw-form__helper" id={`${id}-helper-text`}>
          {description}
        </span>
      ) : null}
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <select
        className="nsw-form__select"
        id={inputId}
        name={inputId}
        value={value}
        disabled={disabled}
        {...attributes}
        onChange={onChange}
        required={required}
        aria-required={required}
      >
        {showNoValueOption ? (
          <option value={noValueOption?.value ?? ''}>
            {noValueOption?.label || typeof noValueOption === 'string'
              ? noValueOption
              : intl.formatMessage(messages.no_value_selected_option)}
          </option>
        ) : null}
        {options.map(({ value, label }) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {isInvalid ? (
        <span
          class="nsw-form__helper nsw-form__helper--error"
          id={`${inputId}-error-text`}
        >
          <span
            class="material-icons nsw-material-icons"
            focusable="false"
            aria-hidden="true"
          >
            cancel
          </span>
          {intl.formatMessage(messages.field_required)}
        </span>
      ) : null}
    </div>
  );
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  noValueOption: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      label: PropTypes.string,
      // TODO: Consolidate value proptype definitions
      value: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
        PropTypes.array,
      ]),
    }),
  ]),
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
    PropTypes.array,
  ]),
  id: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.oneOf([false]),
  ]),
  description: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
};
