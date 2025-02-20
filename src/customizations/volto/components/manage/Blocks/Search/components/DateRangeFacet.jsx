import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { defineMessages, useIntl } from 'react-intl';
import { compose } from 'redux';

import { DateInput } from 'nsw-design-system-plone6/components/Components/Form/DateInput';

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

const DateRangeFacet = (props) => {
  const { facet, isEditMode, onChange, value } = props;
  const intl = useIntl();
  const moment = props.moment.default;

  const startDateValue = value?.[0];
  const endDateValue = value?.[1];

  return (
    <>
      <DateInput
        title={intl.formatMessage(messages.startDate)}
        id={`${facet['@id']}-start-date`}
        value={startDateValue}
        disabled={isEditMode}
        onChange={(value) => {
          // Strict mode to ensure it's YYYY
          const momentValue = moment(value, 'YYYY-MM-DD', true);
          if (!momentValue.isValid()) {
            return;
          }
          if (!value) {
            if (value !== startDateValue) {
              onChange(facet.field.value, [null, endDateValue]);
            }
            return;
          }
          onChange(facet.field.value, [value, endDateValue]);
        }}
      />
      <DateInput
        title={intl.formatMessage(messages.endDate)}
        id={`${facet['@id']}-end-date`}
        value={endDateValue}
        disabled={isEditMode}
        onChange={(value) => {
          // Strict mode to ensure it's YYYY
          const momentValue = moment(value, 'YYYY-MM-DD', true);
          if (!momentValue.isValid()) {
            return;
          }
          if (!value) {
            if (value !== endDateValue) {
              onChange(facet.field.value, [startDateValue, null]);
            }
            return;
          }
          onChange(facet.field.value, [startDateValue, value]);
        }}
      />
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

export default compose(injectLazyLibs(['moment']))(DateRangeFacet);
