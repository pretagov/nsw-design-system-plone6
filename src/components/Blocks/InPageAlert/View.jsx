import cx from 'classnames';
import React from 'react';

const alertTypeIconMapping = {
  info: 'info',
  success: 'check_circle',
  warning: 'error',
  error: 'cancel', // Title is 'critical'
};

const InPageAlertView = ({ data, isEditMode }) => {
  return (
    <div
      className={cx(`nsw-in-page-alert nsw-in-page-alert--${data.alertType}`, {
        'nsw-in-page-alert--compact': data.isCompact,
      })}
      style={data.includeMargin ? null : { marginTop: '0' }}
    >
      <span
        className="material-icons nsw-material-icons nsw-in-page-alert__icon"
        focusable="false"
        aria-hidden="true"
      >
        {alertTypeIconMapping[data.alertType]}
      </span>
      <div
        className="nsw-in-page-alert__content"
        dangerouslySetInnerHTML={{ __html: data.body?.data }}
      ></div>
    </div>
  );
};

export default InPageAlertView;
