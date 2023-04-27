import config from '@plone/volto/registry';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import 'semantic-ui-less/definitions/elements/loader.less';
import { Button, Dimmer, Loader, Message } from 'semantic-ui-react';
import { getFieldName } from 'volto-form-block/components/utils';
import Field from './Field';

import { showWhenValidator } from 'volto-form-block/helpers/show_when';

const messages = defineMessages({
  default_submit_label: {
    id: 'form_default_submit_label',
    defaultMessage: 'Submit',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  success: {
    id: 'form_submit_success',
    defaultMessage: 'Sent!',
  },
  empty_values: {
    id: 'form_empty_values_validation',
    defaultMessage: 'Fill in the required fields',
  },
  reset: {
    id: 'form_reset',
    defaultMessage: 'Clear',
  },
});

const FormView = ({
  formState,
  formErrors,
  formData,
  onChangeFormData,
  data,
  onSubmit,
  resetFormState,
  resetFormOnError,
  captcha,
  id,
}) => {
  const intl = useIntl();
  const FieldSchema = config.blocks.blocksConfig.form.fieldSchema;

  const isValidField = (field) => {
    return formErrors?.indexOf(field) < 0;
  };

  return (
    <>
      {data.title && <h2>{data.title}</h2>}
      {data.description && <p className="description">{data.description}</p>}
      {formState.error ? (
        <Message error role="alert">
          <Message.Header as="h4">
            {intl.formatMessage(messages.error)}
          </Message.Header>
          <p>{formState.error}</p>
          <Button secondary type="clear" onClick={resetFormOnError}>
            {intl.formatMessage(messages.reset)}
          </Button>
        </Message>
      ) : formState.result ? (
        <Message positive role="alert">
          <Message.Header as="h4">
            {intl.formatMessage(messages.success)}
          </Message.Header>
          <p>{formState.result}</p>
          <Button secondary type="clear" onClick={resetFormState}>
            {intl.formatMessage(messages.reset)}
          </Button>
        </Message>
      ) : (
        // TODO: The original component has a `loading` state. Is this needed here?
        <form id={id} className="nsw-form" onSubmit={onSubmit} method="post">
          {data.static_fields?.map((field) => {
            return (
              <Field
                key={field.field_id}
                {...field}
                field_type={field.field_type || 'text'}
                name={
                  'static_field_' +
                  (field.field_id ??
                    field.name?.toLowerCase()?.replace(' ', ''))
                }
                value={field.value}
                onChange={() => {}}
                disabled
                valid
                formHasErrors={formErrors?.length > 0}
              />
            );
          })}
          {data.subblocks?.map((subblock, index) => {
            let name = getFieldName(subblock.label, subblock.id);

            var fields_to_send = [];
            var fieldSchemaProperties = FieldSchema(subblock)?.properties;
            for (var key in fieldSchemaProperties) {
              if (fieldSchemaProperties[key].send_to_backend) {
                fields_to_send.push(key);
              }
            }

            var fields_to_send_with_value = Object.assign(
              {},
              ...fields_to_send.map((field) => {
                return {
                  [field]: subblock[field],
                };
              }),
            );

            const value =
              subblock.field_type === 'static_text'
                ? subblock.value
                : formData[name]?.value;
            const { show_when, target_value } = subblock;

            const shouldShowValidator = showWhenValidator[show_when];
            const shouldShowTargetValue =
              formData[subblock.target_field]?.value;

            // Only checking for false here to preserve backwards compatibility with blocks that haven't been updated and so have a value of 'undefined' or 'null'
            const shouldShow = shouldShowValidator
              ? shouldShowValidator({
                  value: shouldShowTargetValue,
                  target_value: target_value,
                }) !== false
              : true;

            const shouldHide = __CLIENT__ && !shouldShow;

            if (shouldHide) {
              return <p key={'row' + index}>Empty</p>;
            }

            return (
              <Field
                key={'row' + index}
                {...subblock}
                name={name}
                onChange={(field, value) =>
                  onChangeFormData(
                    subblock.id,
                    field,
                    value,
                    fields_to_send_with_value,
                  )
                }
                value={value}
                valid={isValidField(name)}
                formHasErrors={formErrors?.length > 0}
              />
            );
          })}
          {captcha ? captcha.render() : null}
          {formErrors.length > 0 && (
            <Message error role="alert">
              <Message.Header as="h4">
                {intl.formatMessage(messages.error)}
              </Message.Header>
              <p>{intl.formatMessage(messages.empty_values)}</p>
            </Message>
          )}
          <div className="nsw-form__group">
            {formState.loading ? (
              <Dimmer active inverted>
                <Loader inverted>Submitting form</Loader>
              </Dimmer>
            ) : null}
            <input
              type="submit"
              className="nsw-button nsw-button--dark"
              value="Submit"
              // TODO: Disabling buttons is an awful experience, but we need it until we can POST without JS
              disabled={formState.loading}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default FormView;
