/**
 * CheckboxWidget component.
 * @module components/manage/Widgets/CheckboxWidget
 * added aria- attributes
 */

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
  if (required) {
    attributes.required = true;
    attributes['aria-required'] = 'true';
  }

  const isInvalid = invalid === true || invalid === 'true';
  if (isInvalid) {
    attributes['aria-invalid'] = true;
  }

  const checkboxId = `field-${id}`;

  return (
    <FormFieldWrapper {...props} wrapped={false}>
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
      </label>
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
