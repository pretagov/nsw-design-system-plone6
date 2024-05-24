import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { FormFieldWrapper } from '@plone/volto/components';
import { ErrorMessage } from 'nsw-design-system-plone6/components/Components/Form/ErrorMessage';

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
    error = [],
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
  }, [focus, node]);

  // Never fails `isInvalid` if set as required
  const isInvalid = invalid === true || invalid === 'true' || error.length > 0;
  const inputId = `field-${id}`;

  return (
    <FormFieldWrapper
      id={inputId}
      title={title}
      className="text"
      wrapped={false}
    >
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
          disabled={isDisabled ? true : null}
          placeholder={placeholder}
          ref={node}
          value={value || ''}
          onClick={() => onClick()}
          onBlur={({ target }) =>
            onBlur(id, target.value === '' ? null : target.value)
          }
          onChange={({ target }) => {
            return onChange(id, target.value === '' ? null : target.value);
          }}
          aria-invalid={isInvalid ? 'true' : null}
          // The order here matters, as not all Assistive Technology supports multiple describedby
          aria-describedby={cx({
            [`${inputId}-helper-text`]: description,
            [`${inputId}-error-text`]: isInvalid,
          })}
        />
        {isInvalid ? (
          <ErrorMessage inputId={inputId} message={error[0]} />
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
