import cx from 'classnames';
import PropTypes from 'prop-types';
import * as React from 'react';

import loadable from '@loadable/component';
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

function SelectWrapper({ isMultiple, children }) {
  const multiSelectElement = React.useRef(null);
  React.useEffect(() => {
    loadable(() => import('nsw-design-system/src/components/select/select'))
      .load()
      .then((selectJs) => {
        new selectJs.default(multiSelectElement.current).init();
      });
  }, [multiSelectElement]);

  return isMultiple ? (
    <>{children}</>
  ) : (
    <div
      ref={multiSelectElement}
      class="nsw-multi-select js-multi-select"
      data-select-text="Select savings programs"
      data-multi-select-text="{n} savings programs selected"
      data-n-multi-select="2"
    >
      {children}
    </div>
  );
}

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
  multiple = false,
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
      <SelectWrapper>
        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <select
          className={cx('nsw-form__select', { 'js-multi-select': multiple })}
          id={inputId}
          name={inputId}
          value={value}
          disabled={disabled}
          {...attributes}
          onChange={onChange}
          required={required}
          aria-required={required}
          multiple={multiple}
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
      </SelectWrapper>
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
  multiple: PropTypes.bool,
};
