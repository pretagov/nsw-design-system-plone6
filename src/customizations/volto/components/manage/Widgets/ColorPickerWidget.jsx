import { FormFieldWrapper } from '@plone/volto/components';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  Color: {
    id: 'Color',
    defaultMessage: 'Color',
  },
});

const darkColours = [
  'grey-01',
  'green-01',
  'teal-01',
  'blue-01',
  'purple-01',
  'pink-01',
  'red-01',
  'orange-01',
  'yellow-01',
  'brown-01',
  'black',
  'grey-02',
  'green-02',
  'teal-02',
  'blue-02',
  'purple-02',
  'pink-02',
  'red-02',
  'orange-02',
];

// TODO: This widget is HORRIBLY inaccessible. No focus indicator, incorrect click semantics, no indiciation of when a value is changed, etc.
const ColorPickerWidget = (props) => {
  const { id, title, required, value, onChange, colors, className } = props;

  const intl = useIntl();

  React.useEffect(() => {
    if (!props.value && props.default) {
      props.onChange(props.id, props.default);
    }
  });

  function updateColour(colourName) {
    onChange(id, colourName);
    document.documentElement.style.setProperty(
      '--nsw-brand-dark',
      `var(--nsw-palette-${colourName})`,
    );
  }

  return colors.length > 0 ? (
    <FormFieldWrapper
      {...props}
      title={title ? title : intl.formatMessage(messages.Color)}
      className="color_picker"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr) 1fr',
          gap: '2px',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollBehavior: 'smooth',
        }}
      >
        {colors.map((color) => {
          const colourVariable = `var(--nsw-palette-${color.name})`;
          return (
            <>
              <label
                className={
                  darkColours.includes(color.name) ? 'nsw-text--light' : null
                }
                style={{
                  whiteSpace: 'nowrap',
                  borderRadius: 0,
                  backgroundColor: colourVariable,
                  margin: 0,
                  padding: '0.5rem',
                  minHeight: '48px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateColour(color.name);
                }}
              >
                {color.label}
              </label>
              <input
                type="radio"
                name="id"
                key={id + color.name}
                // className={color.name}

                active={value === color.name}
                aria-label={color.label}
                title={color.label}
                className="sr-only"
                style={{
                  borderRadius: 0,
                  backgroundColor: colourVariable,
                  margin: 0,
                }}
              ></input>
            </>
          );
        })}
      </div>
      <p className="nsw-h3">Current colour: {value}</p>
    </FormFieldWrapper>
  ) : null;
};

ColorPickerWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  colors: PropTypes.array,
};

ColorPickerWidget.defaultProps = {
  required: false,
  value: null,
  onChange: null,
  colors: [],
};

export default ColorPickerWidget;
