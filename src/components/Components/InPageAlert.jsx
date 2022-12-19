import cx from 'classnames';
import { isValidElement } from 'react';

const alertTypeIconMapping = {
  info: 'info',
  success: 'check_circle',
  warning: 'error',
  error: 'cancel', // Title is 'critical'
};

export function InPageAlert({ alertType, content, includeMargin, isCompact }) {
  console.log('content');
  return (
    <div
      className={cx(`nsw-in-page-alert nsw-in-page-alert--${alertType}`, {
        'nsw-in-page-alert--compact': isCompact,
      })}
      style={includeMargin ? null : { marginTop: '0' }}
    >
      <span
        className="material-icons nsw-material-icons nsw-in-page-alert__icon"
        focusable="false"
        aria-hidden="true"
      >
        {alertTypeIconMapping[alertType]}
      </span>
      {isValidElement(content) ? (
        content
      ) : (
        <div
          className="nsw-in-page-alert__content"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      )}
    </div>
  );
}
