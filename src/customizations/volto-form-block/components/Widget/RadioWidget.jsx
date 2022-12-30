import { FormFieldWrapper } from '@plone/volto/components';
import cx from 'classnames';
import React from 'react';

const RadioWidget = ({
  id,
  title,
  required,
  description,
  error,
  value,
  valueList,
  onChange,
  fieldSet,
  invalid,
}) => {
  let attributes = {};
  if (required) {
    attributes.required = true;
    attributes['aria-required'] = true;
  }

  const isInvalid = invalid === true || invalid === 'true';
  if (isInvalid) {
    attributes['aria-invalid'] = true;
  }

  return (
    <FormFieldWrapper
      id={id}
      title={title}
      description={description}
      required={required || null}
      error={error}
      fieldSet={fieldSet}
      wrapped={false}
    >
      <div className="nsw-form__group">
        <fieldset className="nsw-form__fieldset">
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
          </legend>
          {valueList.map((opt) => {
            const radioId = id + opt.value;
            return (
              <React.Fragment key={opt.value}>
                <input
                  type="radio"
                  className="nsw-form__radio-input"
                  name={id}
                  id={radioId}
                  value={opt.value}
                  checked={opt.value === value}
                  onChange={(e) => onChange(id, opt.value)}
                  {...attributes}
                />
                <label className="nsw-form__radio-label" htmlFor={radioId}>
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

export default RadioWidget;
