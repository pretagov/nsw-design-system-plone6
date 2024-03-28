/**
 * DatetimeWidget component.
 * @module components/manage/Widgets/DatetimeWidget
 * added aria- attributes
 */
import { FormFieldWrapper } from '@plone/volto/components';
import { parseDateTime } from '@plone/volto/helpers';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { compose } from 'redux';

import { ErrorMessage } from 'nsw-design-system-plone6/components/Components/Form/ErrorMessage';

function DatetimeWidgetComponent(props) {
  const {
    id,
    title,
    description,
    dateOnly = false,
    noPastDates = false,
    resettable = true,
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
    node,
  } = props;

  React.useEffect(() => {
    if (focus) {
      node.focus();
    }
  }, [focus, node]);

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
      onChange(id, `${year}-${month}-${day}`);
    } else {
      onChange(id, null);
    }
  }

  return (
    <FormFieldWrapper
      id={inputId}
      title={title}
      className="text"
      wrapped={false}
    >
      <div className="nsw-form__group">
        <fieldset
          className="nsw-form__date"
          id={inputId}
          aria-describedby={cx({
            [`${inputId}-helper-text`]: description,
            [`${inputId}-error-text`]: isInvalid,
          })}
        >
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
              />
            </div>
          </div>
          {isInvalid ? (
            <ErrorMessage inputId={inputId} message={error[0]} />
          ) : null}
        </fieldset>
      </div>
    </FormFieldWrapper>
  );
}

DatetimeWidgetComponent.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  dateOnly: PropTypes.bool,
  noPastDates: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  resettable: PropTypes.bool,
  value: PropTypes.string,
  focus: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  wrapped: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default DatetimeWidgetComponent;
