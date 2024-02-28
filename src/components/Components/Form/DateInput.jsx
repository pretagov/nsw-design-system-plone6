import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// TODO: i18n of DateInput component
export function DateInput({
  id,
  title,
  description,
  invalid,
  required = false,
  onChange = () => {},
}) {
  const isInvalid = invalid === true || invalid === 'true';
  const inputId = `field-${id}`;

  const dayRef = React.useRef();
  const monthRef = React.useRef();
  const yearRef = React.useRef();

  function handleInputChange() {
    const day = dayRef.current?.value;
    const month = monthRef.current?.value;
    const year = yearRef.current?.value;

    if (day && month && year) {
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange(null);
    }
  }

  return (
    <div className="nsw-form__group">
      <fieldset className="nsw-form__date">
        <legend>
          <span
            className={cx('nsw-form__label', {
              'nsw-form__required': required,
            })}
          >
            {title}
            {required ? <span className="sr-only"> (required)</span> : null}
          </span>
          {description ? (
            <span className="nsw-form__helper" id={`${id}-helper-text`}>
              {description}
            </span>
          ) : null}
        </legend>
        <div className="nsw-form__date-wrapper">
          <div className="nsw-form__date-input">
            <label
              htmlFor={`${inputId}-day`}
              className="nsw-form__label nsw-form__label--small"
            >
              Day
            </label>
            <input
              ref={dayRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="2"
              id={`${inputId}-day`}
              name={`${inputId}-day`}
              className="nsw-form__input"
              onChange={handleInputChange}
              aria-invalid={isInvalid ? true : null}
            />
          </div>
          <div className="nsw-form__date-input">
            <label
              htmlFor={`${inputId}-month`}
              className="nsw-form__label nsw-form__label--small"
            >
              Month
            </label>
            <input
              ref={monthRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="2"
              id={`${inputId}-month`}
              name={`${inputId}-month`}
              className="nsw-form__input"
              onChange={handleInputChange}
              aria-invalid={isInvalid ? true : null}
            />
          </div>
          <div className="nsw-form__date-input nsw-form__date-input--large">
            <label
              htmlFor={`${inputId}-year`}
              className="nsw-form__label nsw-form__label--small"
            >
              Year
            </label>
            <input
              ref={yearRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="4"
              id={`${inputId}-year`}
              name={`${inputId}-year`}
              className="nsw-form__input"
              onChange={handleInputChange}
              aria-invalid={isInvalid ? true : null}
            />
          </div>
        </div>
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
      </fieldset>
    </div>
  );
}

DateInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
    PropTypes.array,
  ]),
  id: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.oneOf([false]),
  ]),
  description: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
};
