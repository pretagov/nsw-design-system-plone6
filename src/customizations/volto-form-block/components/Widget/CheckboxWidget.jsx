/**
 * CheckboxWidget component.
 * @module components/manage/Widgets/CheckboxWidget
 * added aria- attributes
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { FormFieldWrapper } from '@plone/volto/components';

/**
 * CheckboxWidget component class.
 * @function CheckboxWidget
 * @returns {string} Markup of the component.
 *
 * To use it, in schema properties, declare a field like:
 *
 * ```jsx
 * {
 *  title: "Active",
 *  type: 'boolean',
 * }
 * ```
 */
const CheckboxWidget = (props) => {
  const {
    id,
    title,
    value,
    onChange,
    isDisabled,
    required = false,
    invalid,
    error = [],
  } = props;

  let attributes = {};
  // if (required) {
  //   attributes.required = true;
  //   attributes['aria-required'] = 'true';
  // }

  const isInvalid = invalid === true || invalid === 'true';
  if (isInvalid) {
    attributes['aria-invalid'] = true;
  }

  const checkboxId = `field-${id}`;

  return (
    <FormFieldWrapper {...props} wrapped={false}>
      <div className="nsw-form__group">
        <input
          className="nsw-form__checkbox-input"
          type="checkbox"
          name={checkboxId}
          id={checkboxId}
          checked={value || false}
          onChange={({ target }) => {
            onChange(id, target.checked);
          }}
          disabled={isDisabled}
          {...attributes}
        />
        <label className="nsw-form__checkbox-label" htmlFor={checkboxId}>
          {title}
          {required ? (
            <>
              <span className="nsw-form__required"></span>
              <span className="sr-only"> (required)</span>
            </>
          ) : null}
        </label>
        {isInvalid ? (
          <span
            class="nsw-form__helper nsw-form__helper--error"
            id={`${checkboxId}-error-text`}
          >
            <span
              class="material-icons nsw-material-icons"
              focusable="false"
              aria-hidden="true"
            >
              cancel
            </span>
            This field is required
          </span>
        ) : null}
      </div>
    </FormFieldWrapper>
  );
};

CheckboxWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.bool,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  wrapped: PropTypes.bool,
};

export default CheckboxWidget;
