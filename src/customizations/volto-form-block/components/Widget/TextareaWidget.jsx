/**
 * TextareaWidget component.
 * @module components/manage/Widgets/TextareaWidget
 *
 * added aria- attributes
 */

import cx from 'classnames';
import PropTypes from 'prop-types';

import { FormFieldWrapper } from '@plone/volto/components';
import { ErrorMessage } from 'nsw-design-system-plone6/components/Components/Form/ErrorMessage';

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
    value,
    onChange,
    placeholder,
    required,
    invalid,
    isDisabled,
    description,
    error = [],
  } = props;

  const isInvalid = invalid === true || invalid === 'true';

  const inputId = `field-${id}`;

  return (
    <FormFieldWrapper
      id={inputId}
      title={title}
      className="textarea"
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
        <span className="nsw-form__helper" id={`${inputId}-helper-text`}>
          {description}
        </span>
        <textarea
          className="nsw-form__input"
          name={id}
          id={inputId}
          value={value || ''}
          placeholder={placeholder}
          disabled={isDisabled}
          onChange={({ target }) =>
            onChange(id, target.value === '' ? null : target.value)
          }
          aria-invalid={isInvalid ? 'true' : null}
          // The order here matters, as not all Assistive Technology supports multiple describedby
          aria-describedby={cx({
            [`${inputId}-helper-text`]: description,
            [`${inputId}-error-text`]: isInvalid,
          })}
        ></textarea>
        {isInvalid ? (
          <ErrorMessage inputId={inputId} message={error[0]} />
        ) : null}
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
