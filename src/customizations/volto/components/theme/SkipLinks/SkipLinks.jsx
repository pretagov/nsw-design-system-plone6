import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  skipLinksTitle: {
    id: 'skiplink-title',
    defaultMessage: 'Skip to links',
  },
  skipToNavigation: {
    id: 'skiplink-navigation',
    defaultMessage: 'Skip to navigation',
  },
  skipToContent: {
    id: 'skiplink-main-content',
    defaultMessage: 'Skip to content',
  },
});

const SkipLinks = () => {
  const intl = useIntl();

  return (
    <nav
      className="nsw-skip"
      aria-label={intl.formatMessage(messages.skipLinksTitle)}
    >
      <a className="skiplink" href="#main-nav">
        <span>{intl.formatMessage(messages.skipToNavigation)}</span>
      </a>
      <a className="skiplink" href="#view">
        <span>{intl.formatMessage(messages.skipToContent)}</span>
      </a>
    </nav>
    // </div>
  );
};

export default SkipLinks;
