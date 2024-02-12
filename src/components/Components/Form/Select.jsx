import cx from 'classnames';
import PropTypes from 'prop-types';

export function Select({
  options = [],
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
}) {
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

  return (
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
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <select
        className="nsw-form__select"
        id={inputId}
        name={inputId}
        value={value}
        disabled={disabled}
        {...attributes}
        onChange={onChange}
        required={required}
        aria-required={required}
      >
        {options.map(({ value, label }) => {
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
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
  );
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
    PropTypes.array,
  ]),
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
};
