import cx from 'classnames';
import { ErrorMessage } from 'nsw-design-system-plone6/components/Components/Form/ErrorMessage';
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
  multiSelectNoValueText: {
    id: 'multiSelectNoValueText',
    defaultMessage: 'Select {title}s',
  },
  multiSelectGotValueText: {
    id: 'multiSelectGotValueText',
    defaultMessage:
      '{numberSelected} {numberSelected, plural, =1 {{title}} other {{title}s}} selected',
    // {n} savings programs selected
  },
});

function SelectWrapper({ isMultiple, title, amountSelected, children }) {
  const intl = useIntl();

  const multiSelectElement = React.useRef(null);
  React.useEffect(() => {
    if (multiSelectElement) {
      loadable(() => import('nsw-design-system/src/components/select/select'))
        .load()
        .then((selectJs) => {
          new selectJs.default(multiSelectElement.current).init();
        });
    }
  }, [multiSelectElement]);

  // TODO: Should `data-n-multi-select` be configurable? It's the number of items to be selected before displaying `data-multi-select-text` instead.
  return isMultiple ? (
    <div
      ref={multiSelectElement}
      className="nsw-multi-select js-multi-select"
      data-select-text={intl.formatMessage(messages.multiSelectNoValueText, {
        title: title,
      })}
      data-multi-select-text={intl.formatMessage(
        messages.multiSelectGotValueText,
        {
          title: title,
          numberSelected: amountSelected,
        },
      )}
      // data-multi-select-text="{n} savings programs selected"
      data-n-multi-select="2"
    >
      {children}
    </div>
  ) : (
    children
  );
}

// TODO: Fix handling of 'all' button and 'Please select' button
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
  multipleTitle,
  error,
}) {
  const intl = useIntl();
  const [amountSelected, setAmountSelected] = React.useState(0);
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
  // We never want to show the `noValueOption` when in multiple mode, as implied by https://digitalnsw.github.io/nsw-design-system/components/select/index.html#section-interactive-demo
  if (multiple) {
    showNoValueOption = false;
  }

  function handleOptionChange(event) {
    const multiWrapperElement = event.target.parentElement;
    const selectedOptions =
      multiWrapperElement.querySelectorAll('[aria-selected="true"]') || [];
    setAmountSelected(selectedOptions.length);
    onChange(event);
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
      <SelectWrapper
        isMultiple={multiple}
        title={multipleTitle}
        amountSelected={amountSelected}
      >
        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <select
          className={cx('nsw-form__select', { 'js-multi-select': multiple })}
          id={inputId}
          name={inputId}
          value={value}
          disabled={disabled}
          {...attributes}
          onChange={handleOptionChange}
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
        <ErrorMessage
          inputId={inputId}
          message={
            Array.isArray(error) && error.length > 1
              ? error[0]
              : error
              ? error
              : intl.formatMessage(messages.field_required)
          }
        />
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
  multipleTitle: PropTypes.string,
};
