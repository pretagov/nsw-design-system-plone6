import cx from 'classnames';
import { useReducer } from 'react';

// This component does have a JavaScript file, but it's only for adding `hidden`
//    to the alert. This was as of 3.16.1, so things may change.
/**
 *
 * @param {Object} props
 * @param {('light'|'critical')} [props.type]
 */
export function GlobalAlert({ title, description, buttonText, url, type }) {
  const [isHidden, hideAlert] = useReducer(() => true, false);

  return (
    <div
      className={cx('nsw-global-alert js-global-alert', {
        [`nsw-global-alert--${type}`]: ['light', 'critical'].includes(type),
      })}
      role="alert"
      hidden={isHidden ? 'hidden' : null}
    >
      <div className="nsw-global-alert__wrapper">
        <div className="nsw-global-alert__content">
          <div className="nsw-global-alert__title">{title}</div>
          {description ? <p>{description}</p> : null}
        </div>
        {buttonText && url ? (
          <p>
            <a href={url} className="nsw-button nsw-button--white">
              {buttonText}
            </a>
          </p>
        ) : null}
        <button
          className="nsw-icon-button js-close-alert"
          type="button"
          aria-expanded="true"
          onClick={hideAlert}
        >
          <span
            className="material-icons nsw-material-icons"
            focusable="false"
            aria-hidden="true"
          >
            close
          </span>
          <span className="sr-only">Close message</span>
        </button>
      </div>
    </div>
  );
}
