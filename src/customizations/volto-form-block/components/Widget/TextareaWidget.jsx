/**
 * TextareaWidget component.
 * @module components/manage/Widgets/TextareaWidget
 *
 * added aria- attributes
 */

import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { FormFieldWrapper } from '@plone/volto/components';

/**
 * TextareaWidget, a widget for multiple lines text
 *
 * To use it, in schema properties, declare a field like:
 *
 * ```jsx
 * {
 *  title: "Text",
 *  widget: 'textarea',
 * }
 * ```
 */
const TextareaWidget = (props) => {
  const {
    id,
    title,
    maxLength,
    value,
    onChange,
    placeholder,
    required,
    invalid,
    isDisabled,
    description,
    error = [],
  } = props;
  const [lengthError, setlengthError] = useState('');

  const onhandleChange = (id, value) => {
    if (maxLength & value?.length) {
      let remlength = maxLength - value.length;
      if (remlength < 0) {
        setlengthError(`You have exceed word limit by ${Math.abs(remlength)}`);
      } else {
        setlengthError('');
      }
    }
    onChange(id, value);
  };

  let attributes = {};
  if (required) {
    attributes.required = true;
    attributes['aria-required'] = true;
  }

  const isInvalid = invalid === true || invalid === 'true';
  if (lengthError?.length > 0 || isInvalid) {
    attributes['aria-invalid'] = true;
  }

  const inputId = `field-${id}`;

  return (
    <FormFieldWrapper {...props} className="textarea" wrapped={false}>
      <div className="nsw-form__group">
        <label className="nsw-form__label" for={inputId}>
          {title}
        </label>
        <span className="nsw-form__helper" id={`${inputId}-helper-text`}>
          {description}
        </span>
        <textarea
          className="nsw-form__input"
          name={id}
          id={inputId}
          aria-describedby={`${inputId}-helper-text`}
          value={value || ''}
          placeholder={placeholder}
          disabled={isDisabled}
          onChange={({ target }) =>
            onhandleChange(id, target.value === '' ? undefined : target.value)
          }
          {...attributes}
        ></textarea>
        {/* TODO: Handle length validation */}
        {/* {lengthError.length > 0 && (
        <Label key={lengthError} basic color="red" pointing>
          {lengthError}
        </Label>
      )} */}
      </div>
    </FormFieldWrapper>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
TextareaWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  wrapped: PropTypes.bool,
  placeholder: PropTypes.string,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
TextareaWidget.defaultProps = {};

export default TextareaWidget;
