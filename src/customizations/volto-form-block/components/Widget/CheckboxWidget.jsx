/**
 * CheckboxWidget component.
 * @module components/manage/Widgets/CheckboxWidget
 * added aria- attributes
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { FormFieldWrapper } from '@plone/volto/components';
import { ErrorMessage } from 'nsw-design-system-plone6/components/Components/Form/ErrorMessage';

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

  const isInvalid = invalid === true || invalid === 'true';
  const inputId = `field-${id}`;

  return (
    <FormFieldWrapper id={inputId} title={title} wrapped={false}>
      <div className="nsw-form__group">
        <input
          className="nsw-form__checkbox-input"
          type="checkbox"
          name={inputId}
          id={inputId}
          checked={value || false}
          onChange={({ target }) => {
            onChange(id, target.checked);
          }}
          disabled={isDisabled}
        />
        <label className="nsw-form__checkbox-label" htmlFor={inputId}>
          {title}
          {required ? (
            <>
              <span className="nsw-form__required"></span>
              <span className="sr-only"> (required)</span>
            </>
          ) : null}
        </label>
        {isInvalid ? (
          <ErrorMessage inputId={inputId} message={error[0]} />
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
