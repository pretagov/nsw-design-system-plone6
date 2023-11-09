import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { FormFieldWrapper } from '@plone/volto/components';

/**
 * The simple text widget.
 *
 * It is the default fallback widget, so if no other widget is found based on
 * passed field properties, it will be used.
 */
function TextWidget(props) {
  const {
    id,
    title,
    description,
    placeholder,
    invalid,
    required = false,
    error = [], // Isn't passed down from `Field.jsx` so doesn't seem to be a valid prop. Exists in volto-form-block so keeping it here
    isDisabled,
    value,
    draggable,
    onEdit,
    onChange = () => {},
    onBlur = () => {},
    onClick = () => {},
    focus = false,
    minLength,
    maxLength,
    node,
  } = props;
  React.useEffect(() => {
    if (focus) {
      node.focus();
    }
  }, []);

  // Never fails `isInvalid` if set as required
  const isInvalid = invalid === true || invalid === 'true';
  const inputId = `field-${id}`;

  // console.log(error);
  // debugger;

  return (
    <FormFieldWrapper {...props} className="text" wrapped={false}>
      <div className="nsw-form__group">
        <label
          className={cx('nsw-form__label', { 'nsw-form__required': required })}
          htmlFor={inputId}
        >
          {title}
          {required ? <span className="sr-only"> (required)</span> : null}
        </label>
        {description ? (
          <span className="nsw-form__helper" id={`${id}-helper-text`}>
            {description}
          </span>
        ) : null}
        <input
          className="nsw-form__input"
          type="text"
          id={inputId}
          name={id}
          minLength={minLength || null}
          maxLength={maxLength || null}
          aria-invalid={isInvalid ? true : null}
          disabled={isDisabled ? true : null}
          placeholder={placeholder}
          ref={node}
          value={value}
          onClick={() => onClick()}
          onBlur={({ target }) =>
            onBlur(id, target.value === '' ? null : target.value)
          }
          onChange={({ target }) => {
            return onChange(id, target.value === '' ? null : target.value);
          }}
        />
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
            This field is required
          </span>
        ) : null}
      </div>
    </FormFieldWrapper>
  );
}

TextWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  focus: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  wrapped: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default TextWidget;
