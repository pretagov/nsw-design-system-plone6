import { FormFieldWrapper } from '@plone/volto/components';
import cx from 'classnames';
import React from 'react';

import { ErrorMessage } from 'nsw-design-system-plone6/components/Components/Form/ErrorMessage';

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

  const isInvalid = invalid === true || invalid === 'true';
  const inputId = `field-${id}`;

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
          {valueList.map((opt) => {
            const radioId = `${inputId}-${opt.value}`;
            return (
              <React.Fragment key={opt.label}>
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
