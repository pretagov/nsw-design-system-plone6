import cx from 'classnames';
import { useEffect, useReducer, useState } from 'react';

function useIsBrowser() {
  const [isHidden, enableBrowser] = useReducer(() => true, false);
  useEffect(() => {
    enableBrowser();
  }, []);
  return isHidden;
}

// Taken from https://github.com/digitalnsw/nsw-design-system/blob/2e3c1a8fb53a528caade836a56efb60c31ae006d/src/components/global-alert/global-alert.js#L31-L48
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Taken from https://github.com/digitalnsw/nsw-design-system/blob/2e3c1a8fb53a528caade836a56efb60c31ae006d/src/components/global-alert/global-alert.js#L31-L48
function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// TODO: Support customising cookie
const cookieName = 'nsw-plone6-cookie-global-alert-hidden';

// This component does have a JavaScript file, but it's only for adding `hidden`
//    to the alert. This was as of 3.16.1, so things may change.
/**
 *
 * @param {Object} props
 * @param {('light'|'critical')} [props.type]
 */
export function GlobalAlert({ title, description, buttonText, url, type }) {
  const isBrowser = useIsBrowser();
  function shouldShowBanner() {
    const value = isBrowser && getCookie(cookieName) === 'dismissed';
    return value;
  }
  // Useless bit of state to force a re-render.
  const [_, setIsHidden] = useState(shouldShowBanner());

  function hideAlert() {
    setCookie(cookieName, 'dismissed', 7);
    setIsHidden(true);
  }

  return (
    <div
      className={cx('nsw-global-alert js-global-alert', {
        [`nsw-global-alert--${type}`]: ['light', 'critical'].includes(type),
      })}
      role="alert"
      hidden={shouldShowBanner() ? 'hidden' : null}
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
