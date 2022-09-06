import { getVocabulary, getVocabularyTokenTitle } from '@plone/volto/actions';
import { FormFieldWrapper } from '@plone/volto/components';
import { normalizeValue } from '@plone/volto/components/manage/Widgets/SelectUtils';
import {
  getVocabFromField,
  getVocabFromHint,
  getVocabFromItems,
} from '@plone/volto/helpers';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';

const messages = defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  idTitle: {
    id: 'Short Name',
    defaultMessage: 'Short Name',
  },
  idDescription: {
    id: 'Used for programmatic access to the fieldset.',
    defaultMessage: 'Used for programmatic access to the fieldset.',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  close: {
    id: 'Close',
    defaultMessage: 'Close',
  },
  choices: {
    id: 'Choices',
    defaultMessage: 'Choices',
  },
  required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
  select: {
    id: 'Select…',
    defaultMessage: 'Select…',
  },
  no_value: {
    id: 'No value',
    defaultMessage: 'No value',
  },
  no_options: {
    id: 'No options',
    defaultMessage: 'No options',
  },
});

function SelectWidget(props) {
  const {
    description,
    required = false,
    vocabBaseUrl,
    choices = [],
    value,
    onChange = () => {},
    noValueOption = true,
    id,
    default: defaultOption,
    disabled,
    isDisabled,
    invalid,
    title,
  } = props;
  const intl = useIntl();
  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  React.useEffect(() => {
    if ((!choices || choices?.length === 0) && vocabBaseUrl) {
      getVocabulary({
        vocabNameOrURL: vocabBaseUrl,
        size: -1,
        subrequest: intl.locale,
      });
    }
  }, []);

  const normalizedValue = normalizeValue(choices, value, intl);
  // Make sure that both disabled and isDisabled (from the DX layout feat work)
  const shouldDisable = disabled || isDisabled;

  let options = vocabBaseUrl
    ? choices
    : [
        ...map(choices, (option) => ({
          value: option[0],
          label:
            // Fix "None" on the serializer, to remove when fixed in p.restapi
            option[1] !== 'None' && option[1] ? option[1] : option[0],
        })),
        // Only set "no-value" option if there's no default in the field
        // TODO: also if this.props.defaultValue?
        ...(noValueOption && !defaultOption
          ? [
              {
                label: intl.formatMessage(messages.no_value),
                value: 'no-value',
              },
            ]
          : []),
      ];

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
    <FormFieldWrapper {...props} wrapped={false}>
      <div className="nsw-form__group">
        <label className="nsw-form__label" htmlFor={inputId}>
          {title}
        </label>
        {description ? (
          <span className="nsw-form__helper" id={`${id}-helper-text`}>
            {description}
          </span>
        ) : null}
        <select
          className="nsw-form__select"
          id={inputId}
          // TODO: Do we need a name here?
          value={normalizedValue}
          isDisabled={shouldDisable}
          {...attributes}
          onChange={({ target: selectedOption }) => {
            return onChange(
              id,
              selectedOption && selectedOption.value !== 'no-value'
                ? selectedOption.value
                : undefined,
            );
          }}
        >
          {options.map(({ value, label }) => {
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
    </FormFieldWrapper>
  );
}

SelectWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  getVocabulary: PropTypes.func.isRequired,
  getVocabularyTokenTitle: PropTypes.func.isRequired,
  choices: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  ),
  items: PropTypes.shape({
    vocabulary: PropTypes.object,
  }),
  widgetOptions: PropTypes.shape({
    vocabulary: PropTypes.object,
  }),
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.func,
    PropTypes.array,
  ]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  wrapped: PropTypes.bool,
  noValueOption: PropTypes.bool,
  customOptionStyling: PropTypes.any,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default compose(
  connect(
    (state, props) => {
      const vocabBaseUrl = !props.choices
        ? getVocabFromHint(props) ||
          getVocabFromField(props) ||
          getVocabFromItems(props)
        : '';

      const vocabState =
        state.vocabularies?.[vocabBaseUrl]?.subrequests?.[props.intl.locale];

      // If the schema already has the choices in it, then do not try to get the vocab,
      // even if there is one
      if (props.choices) {
        return {
          choices: props.choices,
        };
      } else if (vocabState) {
        return {
          vocabBaseUrl,
          choices: vocabState?.items ?? [],
        };
        // There is a moment that vocabState is not there yet, so we need to pass the
        // vocabBaseUrl to the component.
      } else if (vocabBaseUrl) {
        return {
          vocabBaseUrl,
        };
      }
      return {};
    },
    { getVocabulary, getVocabularyTokenTitle },
  ),
)(SelectWidget);
