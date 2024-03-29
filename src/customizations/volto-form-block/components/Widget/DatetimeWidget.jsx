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
    <FormFieldWrapper {...props} className="text" wrapped={false}>
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
        {/* <input
          className="nsw-form__input"
          type="text"
          id={inputId}
          name={id}
          minLength={minLength || null}
          maxLength={maxLength || null}
          required={required ? true : null}
          aria-required={required ? true : null}
          aria-invalid={isInvalid ? true : null}
          disabled={isDisabled ? true : null}
          placeholder={placeholder}
          ref={node}
          defaultValue={value}
          onClick={() => onClick()}
          onBlur={({ target }) =>
            onBlur(id, target.value === '' ? undefined : target.value)
          }
          onChange={({ target }) => {
            return onChange(id, target.value === '' ? undefined : target.value);
          }}
        /> */}
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

//  */
// export class DatetimeWidgetComponent extends Component {
//   /**
//    * Constructor
//    * @method constructor
//    * @param {Object} props Component properties
//    * @constructs DatetimeWidget
//    */
//   constructor(props) {
//     super(props);

//     this.state = {
//       focused: false,
//       // if passed value matches the construction time, we guess it's a default
//       isDefault:
//         parseDateTime(
//           this.props.intl.locale,
//           this.props.value,
//           undefined,
//           this.moment,
//         )?.toISOString() === this.moment().utc().toISOString(),
//     };
//   }

//   getInternalValue() {
//     return parseDateTime(
//       this.props.intl.locale,
//       this.props.value,
//       undefined,
//       this.moment,
//     );
//   }

//   getDateOnly() {
//     return this.props.dateOnly || this.props.widget === 'date';
//   }

//   /**
//    * Update date storage
//    * @method onDateChange
//    * @param {Object} date updated momentjs Object for date
//    * @returns {undefined}
//    */
//   onDateChange = (date) => {
//     if (date) {
//       const moment = this.props.moment.default;
//       const isDateOnly = this.getDateOnly();
//       const base = (this.getInternalValue() || moment()).set({
//         year: date.year(),
//         month: date.month(),
//         date: date.date(),
//         ...(isDateOnly ? defaultTimeDateOnly : {}),
//       });
//       const dateValue = isDateOnly
//         ? base.format('YYYY-MM-DD')
//         : base.toISOString();
//       this.props.onChange(this.props.id, dateValue);
//     }
//     this.setState({ isDefault: false });
//   };

//   /**
//    * Update date storage
//    * @method onTimeChange
//    * @param {Object} time updated momentjs Object for time
//    * @returns {undefined}
//    */
//   onTimeChange = (time) => {
//     const moment = this.props.moment.default;
//     if (time) {
//       const base = (this.getInternalValue() || moment()).set({
//         hours: time?.hours() ?? 0,
//         minutes: time?.minutes() ?? 0,
//         seconds: 0,
//       });
//       const dateValue = base.toISOString();
//       this.props.onChange(this.props.id, dateValue);
//     }
//   };

//   onResetDates = () => {
//     this.setState({ isDefault: false });
//     this.props.onChange(this.props.id, null);
//   };

//   render() {
//     const {
//       id,
//       resettable,
//       intl,
//       reactDates,
//       widgetOptions,
//       invalid,
//       required,
//     } = this.props;
//     const noPastDates =
//       this.props.noPastDates || widgetOptions?.pattern_options?.noPastDates;
//     const moment = this.props.moment.default;
//     const datetime = this.getInternalValue();
//     const dateOnly = this.getDateOnly();
//     const { SingleDatePicker } = reactDates;

//     let attributes = {};
//     if (required) {
//       attributes.required = true;
//       attributes['aria-required'] = true;
//     }

//     const isInvalid = invalid === true || invalid === 'true';
//     if (isInvalid) {
//       attributes['aria-invalid'] = true;
//     }

//     return (
//       <FormFieldWrapper {...this.props}>
//         <div className="date-time-widget-wrapper">
//           <div
//             className={cx('ui input date-input', {
//               'default-date': this.state.isDefault,
//             })}
//           >
//             <SingleDatePicker
//               date={datetime}
//               disabled={this.props.isDisabled}
//               onDateChange={this.onDateChange}
//               focused={this.state.focused}
//               numberOfMonths={1}
//               {...(noPastDates ? {} : { isOutsideRange: () => false })}
//               onFocusChange={this.onFocusChange}
//               noBorder
//               displayFormat={moment.localeData(intl.locale).longDateFormat('L')}
//               navPrev={<PrevIcon />}
//               navNext={<NextIcon />}
//               id={`${id}-date`}
//               placeholder={intl.formatMessage(messages.date)}
//               {...attributes}
//             />
//           </div>
//           {!dateOnly && (
//             <div
//               className={cx('ui input time-input', {
//                 'default-date': this.state.isDefault,
//               })}
//             >
//               <TimePicker
//                 disabled={this.props.isDisabled}
//                 defaultValue={datetime}
//                 value={datetime}
//                 onChange={this.onTimeChange}
//                 allowEmpty={false}
//                 showSecond={false}
//                 use12Hours={intl.locale === 'en'}
//                 id={`${id}-time`}
//                 format={moment.localeData(intl.locale).longDateFormat('LT')}
//                 placeholder={intl.formatMessage(messages.time)}
//                 focusOnOpen
//                 placement="bottomRight"
//               />
//             </div>
//           )}
//           {resettable && (
//             <button
//               disabled={this.props.isDisabled || !datetime}
//               onClick={() => this.onResetDates()}
//               className="item ui noborder button"
//             >
//               <Icon name={clearSVG} size="24px" className="close" />
//             </button>
//           )}
//         </div>
//       </FormFieldWrapper>
//     );
//   }
// }

// /**
//  * DatetimeWidget component.
//  * @module components/manage/Widgets/DatetimeWidget
//  * added aria- attributes
//  */
// import loadable from '@loadable/component';
// import { FormFieldWrapper, Icon } from '@plone/volto/components';
// import { parseDateTime } from '@plone/volto/helpers';
// import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
// import cx from 'classnames';
// import PropTypes from 'prop-types';
// import React, { Component } from 'react';
// import { defineMessages, injectIntl } from 'react-intl';
// import { compose } from 'redux';

// import clearSVG from '@plone/volto/icons/clear.svg';
// import leftKey from '@plone/volto/icons/left-key.svg';
// import rightKey from '@plone/volto/icons/right-key.svg';

// import 'rc-time-picker/assets/index.css';
// import 'react-dates/initialize';
// import 'react-dates/lib/css/_datepicker.css';

// const TimePicker = loadable(() => import('rc-time-picker'));

// const messages = defineMessages({
//   date: {
//     id: 'Date',
//     defaultMessage: 'Date',
//   },
//   time: {
//     id: 'Time',
//     defaultMessage: 'Time',
//   },
// });

// const PrevIcon = () => (
//   <div
//     style={{
//       color: '#000',
//       left: '22px',
//       padding: '5px',
//       position: 'absolute',
//       top: '15px',
//     }}
//     // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
//     tabIndex="0"
//   >
//     <Icon name={leftKey} size="30px" />
//   </div>
// );
// const NextIcon = () => (
//   <div
//     style={{
//       color: '#000',
//       right: '22px',
//       padding: '5px',
//       position: 'absolute',
//       top: '15px',
//     }}
//     // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
//     tabIndex="0"
//   >
//     <Icon name={rightKey} size="30px" />
//   </div>
// );

// const defaultTimeDateOnly = {
//   hour: 12,
//   minute: 0,
//   second: 0,
// };

// /**
//  * DatetimeWidget component class
//  * @class DatetimeWidget
//  * @extends Component
//  *
//  * To use it, in schema properties, declare a field like:
//  *
//  * ```jsx
//  * {
//  *  title: "Publish date",
//  *  type: 'datetime',
//  * }
//  * ```
//  */
// export class DatetimeWidgetComponent extends Component {
//   /**
//    * Constructor
//    * @method constructor
//    * @param {Object} props Component properties
//    * @constructs DatetimeWidget
//    */
//   constructor(props) {
//     super(props);
//     this.moment = props.moment.default;

//     this.state = {
//       focused: false,
//       // if passed value matches the construction time, we guess it's a default
//       isDefault:
//         parseDateTime(
//           this.props.intl.locale,
//           this.props.value,
//           undefined,
//           this.moment,
//         )?.toISOString() === this.moment().utc().toISOString(),
//     };
//   }

//   getInternalValue() {
//     return parseDateTime(
//       this.props.intl.locale,
//       this.props.value,
//       undefined,
//       this.moment,
//     );
//   }

//   getDateOnly() {
//     return this.props.dateOnly || this.props.widget === 'date';
//   }

//   /**
//    * Update date storage
//    * @method onDateChange
//    * @param {Object} date updated momentjs Object for date
//    * @returns {undefined}
//    */
//   onDateChange = (date) => {
//     if (date) {
//       const moment = this.props.moment.default;
//       const isDateOnly = this.getDateOnly();
//       const base = (this.getInternalValue() || moment()).set({
//         year: date.year(),
//         month: date.month(),
//         date: date.date(),
//         ...(isDateOnly ? defaultTimeDateOnly : {}),
//       });
//       const dateValue = isDateOnly
//         ? base.format('YYYY-MM-DD')
//         : base.toISOString();
//       this.props.onChange(this.props.id, dateValue);
//     }
//     this.setState({ isDefault: false });
//   };

//   /**
//    * Update date storage
//    * @method onTimeChange
//    * @param {Object} time updated momentjs Object for time
//    * @returns {undefined}
//    */
//   onTimeChange = (time) => {
//     const moment = this.props.moment.default;
//     if (time) {
//       const base = (this.getInternalValue() || moment()).set({
//         hours: time?.hours() ?? 0,
//         minutes: time?.minutes() ?? 0,
//         seconds: 0,
//       });
//       const dateValue = base.toISOString();
//       this.props.onChange(this.props.id, dateValue);
//     }
//   };

//   onResetDates = () => {
//     this.setState({ isDefault: false });
//     this.props.onChange(this.props.id, null);
//   };

//   /**
//    * Handle SingleDatePicker focus
//    * @method onFocusChange
//    * @param {boolean} focused component focus state.
//    * @returns {undefined}
//    */
//   onFocusChange = ({ focused }) => this.setState({ focused });

//   render() {
//     const {
//       id,
//       resettable,
//       intl,
//       reactDates,
//       widgetOptions,
//       invalid,
//       required,
//     } = this.props;
//     const noPastDates =
//       this.props.noPastDates || widgetOptions?.pattern_options?.noPastDates;
//     const moment = this.props.moment.default;
//     const datetime = this.getInternalValue();
//     const dateOnly = this.getDateOnly();
//     const { SingleDatePicker } = reactDates;

//     let attributes = {};
//     if (required) {
//       attributes.required = true;
//       attributes['aria-required'] = true;
//     }

//     const isInvalid = invalid === true || invalid === 'true';
//     if (isInvalid) {
//       attributes['aria-invalid'] = true;
//     }

//     console.log('value', this.props.value);

//     return (
//       <FormFieldWrapper {...this.props}>
//         <div className="date-time-widget-wrapper">
//           <div
//             className={cx('ui input date-input', {
//               'default-date': this.state.isDefault,
//             })}
//           >
//             <SingleDatePicker
//               date={datetime}
//               disabled={this.props.isDisabled}
//               onDateChange={this.onDateChange}
//               focused={this.state.focused}
//               numberOfMonths={1}
//               {...(noPastDates ? {} : { isOutsideRange: () => false })}
//               onFocusChange={this.onFocusChange}
//               noBorder
//               displayFormat={moment.localeData(intl.locale).longDateFormat('L')}
//               navPrev={<PrevIcon />}
//               navNext={<NextIcon />}
//               id={`${id}-date`}
//               placeholder={intl.formatMessage(messages.date)}
//               {...attributes}
//             />
//           </div>
//           {!dateOnly && (
//             <div
//               className={cx('ui input time-input', {
//                 'default-date': this.state.isDefault,
//               })}
//             >
//               <TimePicker
//                 disabled={this.props.isDisabled}
//                 defaultValue={datetime}
//                 value={datetime}
//                 onChange={this.onTimeChange}
//                 allowEmpty={false}
//                 showSecond={false}
//                 use12Hours={intl.locale === 'en'}
//                 id={`${id}-time`}
//                 format={moment.localeData(intl.locale).longDateFormat('LT')}
//                 placeholder={intl.formatMessage(messages.time)}
//                 focusOnOpen
//                 placement="bottomRight"
//               />
//             </div>
//           )}
//           {resettable && (
//             <button
//               disabled={this.props.isDisabled || !datetime}
//               onClick={() => this.onResetDates()}
//               className="item ui noborder button"
//             >
//               <Icon name={clearSVG} size="24px" className="close" />
//             </button>
//           )}
//         </div>
//       </FormFieldWrapper>
//     );
//   }
// }

// /**
//  * Property types.
//  * @property {Object} propTypes Property types.
//  * @static
//  */
// DatetimeWidgetComponent.propTypes = {
//   id: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string,
//   required: PropTypes.bool,
//   error: PropTypes.arrayOf(PropTypes.string),
//   dateOnly: PropTypes.bool,
//   noPastDates: PropTypes.bool,
//   value: PropTypes.string,
//   onChange: PropTypes.func.isRequired,
//   wrapped: PropTypes.bool,
//   resettable: PropTypes.bool,
// };

// /**
//  * Default properties.
//  * @property {Object} defaultProps Default properties.
//  * @static
//  */
// DatetimeWidgetComponent.defaultProps = {
//   description: null,
//   required: false,
//   error: [],
//   dateOnly: false,
//   noPastDates: false,
//   value: null,
//   resettable: true,
// };

// export default compose(
//   injectLazyLibs(['reactDates', 'moment']),
//   injectIntl,
// )(DatetimeWidgetComponent);
