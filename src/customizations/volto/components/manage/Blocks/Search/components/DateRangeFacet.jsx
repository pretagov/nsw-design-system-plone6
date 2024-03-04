import { Icon } from '@plone/volto/components';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import React, { useState } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Header } from 'semantic-ui-react';

import clearSVG from '@plone/volto/icons/clear.svg';
import leftKey from '@plone/volto/icons/left-key.svg';
import rightKey from '@plone/volto/icons/right-key.svg';

import { DateInput } from 'nsw-design-system-plone6/components/Components/Form/DateInput';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const messages = defineMessages({
  startDate: {
    id: 'Start Date',
    defaultMessage: 'Start Date',
  },
  endDate: {
    id: 'End Date',
    defaultMessage: 'End Date',
  },
});

const PrevIcon = () => (
  <div
    className="prev-icon"
    style={{
      color: '#000',
      left: '22px',
      padding: '5px',
      position: 'absolute',
      top: '15px',
    }}
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    tabIndex="0"
  >
    <Icon name={leftKey} size="30px" />
  </div>
);
const NextIcon = () => (
  <div
    className="next-icon"
    style={{
      color: '#000',
      right: '22px',
      padding: '5px',
      position: 'absolute',
      top: '15px',
    }}
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    tabIndex="0"
  >
    <Icon name={rightKey} size="30px" />
  </div>
);

const CloseIcon = () => <Icon name={clearSVG} size="24px" className="close" />;

const DateRangeFacet = (props) => {
  const { facet, isEditMode, onChange, value, reactDates, intl, lang } = props;
  const moment = props.moment.default;
  const { DateRangePicker } = reactDates;
  const [focused, setFocused] = useState(null);

  const { title: facetLabel, '@id': facetId } = facet;

  const startDateValue = value && value[0] ? moment(value[0]) : null;
  const endDateValue = value && value[1] ? moment(value[1]) : null;

  function updateDate(startDate, endDate) {
    const isStartDate = startDate === startDateValue && !endDate;
    // Bit of an assumption here
    const value = isStartDate ? startDate : endDate;
    // Strict mode to ensure it's YYYY
    const momentValue = moment(value, 'YYYY-MM-DD', true);
    if (!momentValue.isValid()) {
      return;
    }
    if (!value) {
      if (value !== startDateValue) {
        onChange(
          facet.field.value,
          isStartDate ? [null, endDateValue] : [startDateValue, null],
        );
      }
      return;
    }
    onChange(
      facet.field.value,
      isStartDate ? [value, endDateValue] : [startDateValue, value],
    );
  }

  return (
    <>
      {/* <div className="daterange-facet">
        <Header as="h4">{facet?.title ?? facet?.field?.label}</Header>
        <div className="ui form date-time-widget-wrapper">
          <div className="ui input date-input">
            <DateRangePicker
              startDate={startDateValue}
              startDateId={`${facet['@id']}-start-date`}
              startDatePlaceholderText={intl.formatMessage(messages.startDate)}
              endDate={endDateValue}
              endDateId={`${facet['@id']}-end-date`}
              endDatePlaceholderText={intl.formatMessage(messages.endDate)}
              numberOfMonths={1}
              disabled={isEditMode}
              noBorder
              showClearDates
              customCloseIcon={<CloseIcon />}
              displayFormat={moment.localeData(lang).longDateFormat('L')}
              focusedInput={focused}
              onFocusChange={(focusedInput) => setFocused(focusedInput)}
              onDatesChange={({ startDate, endDate }) => {
                debugger;
                onChange(facet.field.value, [
                  startDate ? startDate.format('YYYY-MM-DD') : null,
                  endDate ? endDate.format('YYYY-MM-DD') : null,
                ]);
              }}
              isOutsideRange={() => false}
              navPrev={<PrevIcon />}
              navNext={<NextIcon />}
            />
          </div>
        </div>
      </div>
      <div className="nsw-stuff"> */}
      <DateInput
        title={intl.formatMessage(messages.startDate)}
        id={`${facet['@id']}-start-date`}
        value={startDateValue}
        disabled={isEditMode}
        onChange={(value) => {
          updateDate(value, endDateValue);
        }}
      />
      <DateInput
        title={intl.formatMessage(messages.endDate)}
        id={`${facet['@id']}-end-date`}
        value={endDateValue}
        disabled={isEditMode}
        onChange={(value) => {
          updateDate(startDateValue, value);
        }}
      />
      {/* </div> */}
    </>
  );
};

DateRangeFacet.stateToValue = ({ facetSettings, index, selectedValue }) => {
  return selectedValue || [null, null];
};

DateRangeFacet.valueToQuery = ({ value, facet }) => {
  return value && typeof value[0] === 'string' && typeof value[1] === 'string'
    ? {
        i: facet.field.value,
        o: 'plone.app.querystring.operation.date.between',
        v: value,
      }
    : null;
};

export default compose(
  injectLazyLibs(['reactDates', 'moment']),
  connect((state) => ({
    lang: state.intl.locale,
  })),
  injectIntl,
)(DateRangeFacet);
