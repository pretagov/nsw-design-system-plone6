import { FormFieldWrapper } from '@plone/volto/components';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';

const messages = defineMessages({
  Color: {
    id: 'Color',
    defaultMessage: 'Color',
  },
});

const ColorPickerWidget = (props) => {
  const { id, title, required, value, onChange, colors, className } = props;

  const intl = useIntl();

  React.useEffect(() => {
    if (!props.value && props.default) {
      props.onChange(props.id, props.default);
    }
    // Yes, this is correct.
  });

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
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: 0,
        }}
      >
        {colors.map((color) => {
          const colourVariable = `var(--nsw-palette-${color.name})`;
          return (
            <>
              <Button
                key={id + color.name}
                // className={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(id, color.name);
                  // document.body.style.setProperty(
                  //   '--nsw-brand-dark',
                  //   color.name,
                  // );
                  document.documentElement.style.setProperty(
                    '--nsw-brand-dark',
                    colourVariable,
                  );
                }}
                active={value === color.name}
                circular
                aria-label={color.label}
                title={color.label}
                style={{
                  borderRadius: 0,
                  backgroundColor: colourVariable,
                  margin: 0,
                }}
              >
                {color.label}
              </Button>
            </>
          );
        })}
      </div>
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
