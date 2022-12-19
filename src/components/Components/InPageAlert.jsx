import cx from 'classnames';
import { isValidElement } from 'react';

const backgroundColourMapping = {
  dark: 'var(--nsw-brand-dark)',
  light: 'var(--nsw-brand-light)',
  supplementary: 'var(--nsw-brand-supplementary)',
  accent: 'var(--nsw-brand-accent)',
};
const textColourMapping = {
  dark: 'var(--nsw-text-light)',
  light: 'var(--nsw-text-dark)',
  supplementary: 'var(--nsw-text-light)',
  accent: 'var(--nsw-text-light)',
};
const iconColourMapping = {
  dark: 'var(--nsw-brand-accent)',
  light: 'var(--nsw-brand-accent)',
  supplementary: 'var(--nsw-palette-white)',
  accent: 'var(--nsw-palette-white)',
};

const alertTypeIconMapping = {
  info: 'info',
  success: 'check_circle',
  warning: 'error',
  error: 'cancel', // Title is 'critical'
};

// TODO: InPageAlert component props are a mess, too flexible/ can create clashing combos
export function InPageAlert({
  alertType,
  content,
  colour,
  includeMargin,
  includeContainer,
  isCompact,
}) {
  const iconStyle = {};
  const backgroundStyle = {};
  if (colour) {
    iconStyle['color'] = iconColourMapping[colour];
    backgroundStyle['borderLeft'] = '0';
    backgroundStyle['backgroundColor'] = backgroundColourMapping[colour];
    backgroundStyle['color'] = textColourMapping[colour];
  }
  if (includeMargin) {
    backgroundStyle['marginBlockStart'] = '0';
  }

  return (
    <div
      className={cx(`nsw-in-page-alert nsw-in-page-alert--${alertType}`, {
        'nsw-in-page-alert--compact': isCompact,
      })}
      style={backgroundStyle}
    >
      {includeContainer ? (
        <>
          <div
            style={{
              display: 'flex',
              marginInline: 'auto',
              width: '100%',
              maxWidth: 'var(--nsw-container-width)',
            }}
          >
            <span
              className="material-icons nsw-material-icons nsw-in-page-alert__icon"
              style={iconStyle}
              focusable="false"
              aria-hidden="true"
            >
              chevron_right
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
        </>
      ) : (
        <>
          <span
            className="material-icons nsw-material-icons nsw-in-page-alert__icon"
            style={iconStyle}
            focusable="false"
            aria-hidden="true"
          >
            {alertTypeIconMapping[alertType] ?? alertType}
          </span>
          {isValidElement(content) ? (
            content
          ) : (
            <div
              className="nsw-in-page-alert__content"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          )}
        </>
      )}
    </div>
  );
}
