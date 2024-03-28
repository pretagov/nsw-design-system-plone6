import { FormFieldWrapper } from '@plone/volto/components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { ErrorMessage } from 'nsw-design-system-plone6/components/Components/Form/ErrorMessage';

const CheckboxListWidget = ({
  id,
  title,
  required = false,
  description,
  error = [],
  value = [],
  valueList,
  onChange,
  fieldSet,
  invalid,
}) => {
  const updateValueList = (val, checked) => {
    let newValue = new Set([...(value || [])]);
    if (checked) newValue.add(val);
    else newValue.delete(val);

    onChange(id, [...newValue]);
  };

  const isInvalid = invalid === true || invalid === 'true';
  const inputId = `field-${id}`;

  return (
    <FormFieldWrapper
      id={id}
      title={title}
      description={description}
      required={required || null}
      fieldSet={fieldSet}
      wrapped={false}
    >
      <div className="nsw-form__group">
        <fieldset className="nsw-form__fieldset" id={inputId}>
          <legend>
            <span
              className={cx('nsw-form__legend', {
                'nsw-form__required': required,
              })}
            >
              {title}
              {required ? <span className="sr-only"> (required)</span> : null}
            </span>
            {description ? (
              <span className="nsw-form__helper">{description}</span>
            ) : null}
            {isInvalid ? (
              <ErrorMessage inputId={inputId} message={error[0]} />
            ) : null}
          </legend>
          {valueList?.map((opt) => {
            const checkboxId = `${inputId}-${opt.value}`;
            return (
              <React.Fragment key={checkboxId}>
                <input
                  className="nsw-form__checkbox-input"
                  type="checkbox"
                  name={`field-${id}-${opt.value}`}
                  id={checkboxId}
                  checked={value?.includes(opt.value)}
                  onChange={({ target }) => {
                    return updateValueList(opt.value, target.checked);
                  }}
                />
                <label
                  className="nsw-form__checkbox-label"
                  htmlFor={checkboxId}
                >
                  {opt.label}
                </label>
              </React.Fragment>
            );
          })}
        </fieldset>
      </div>
    </FormFieldWrapper>
  );
};

CheckboxListWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  wrapped: PropTypes.bool,
};

export default CheckboxListWidget;
