import PropTypes from 'prop-types';
import React from 'react';

import { FormFieldWrapper, Icon } from '@plone/volto/components';

/**
 * The simple text widget.
 *
 * It is the default fallback widget, so if no other widget is found based on
 * passed field properties, it will be used.
 */
function TextWidget({
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
  onEdit,
  onDelete,
  focus = false,
  icon,
  iconAction,
  minLength,
  maxLength,
  node,
  ...props
}) {
  React.useEffect(() => {
    if (focus) {
      node.focus();
    }
  }, []);

  const isInvalid =
    error?.length > 0 && (invalid === true || invalid === 'true');
  const inputId = `field-${id}`;

  console.log(props);

  return (
    <FormFieldWrapper {...props} className="text">
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
          type="text"
          id={inputId}
          name={id}
          minLength={minLength || null}
          maxLength={maxLength || null}
          onBlur={({ target }) =>
            onBlur(id, target.value === '' ? undefined : target.value)
          }
          onClick={() => onClick()}
          required={required ? true : null}
          aria-required={required ? true : null}
          aria-invalid={isInvalid ? true : null}
          disabled={isDisabled ? true : null}
          placeholder={placeholder}
          ref={node}
          // To clean
          value={value || ''}
          onChange={({ target }) =>
            onChange(id, target.value === '' ? undefined : target.value)
          }
        />
      </div>
      {/* <button className={`field-${id}-action-button`} onClick={iconAction}>
        <Icon name={icon} size="18px" />
      </button> */}
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
  icon: PropTypes.shape({
    xmlns: PropTypes.string,
    viewBox: PropTypes.string,
    content: PropTypes.string,
  }),
  iconAction: PropTypes.func,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  wrapped: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default TextWidget;
