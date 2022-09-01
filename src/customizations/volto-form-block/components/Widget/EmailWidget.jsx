import PropTypes from 'prop-types';
import React from 'react';

import { FormFieldWrapper } from '@plone/volto/components';

/** EmailWidget, a widget for email addresses
 *
 * To use it, in schema properties, declare a field like:
 *
 * ```jsx
 * {
 *  title: "Email",
 *  widget: 'email',
 * }
 * ```
 */
function EmailWidget(props) {
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

  const isInvalid =
    error?.length > 0 && (invalid === true || invalid === 'true');
  const inputId = `field-${id}`;

  return (
    <FormFieldWrapper {...props} className="text" wrapped={false}>
      <div className="nsw-form__group">
        <label className="nsw-form__label" for={inputId}>
          {title}
        </label>
        {description ? (
          <span className="nsw-form__helper" id={`${id}-helper-text`}>
            {description}
          </span>
        ) : null}
        <input
          className="nsw-form__input"
          type="email"
          id={inputId}
          name={id}
          minLength={minLength || null}
          maxLength={maxLength || null}
          required={required ? true : null}
          aria-required={required ? true : null}
          aria-invalid={isInvalid ? true : null}
          disabled={isDisabled ? true : null}
          placeholder={placeholder}
          ref={node}
          defaultValue={value}
          onClick={() => onClick()}
          onBlur={({ target }) =>
            onBlur(id, target.value === '' ? undefined : target.value)
          }
          onChange={({ target }) => {
            return onChange(id, target.value === '' ? undefined : target.value);
          }}
        />
      </div>
    </FormFieldWrapper>
  );
}

EmailWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
};

export default EmailWidget;
