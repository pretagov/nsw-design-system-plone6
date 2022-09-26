import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  skipLinksTitle: {
    id: 'skiplink-title',
    defaultMessage: 'Skip to links',
  },
  skipToNavigation: {
    id: 'skiplink-main-content',
    defaultMessage: 'Skip to navigation',
  },
  skipToContent: {
    id: 'skiplink-navigation',
    defaultMessage: 'Skip to content',
  },
  footer: {
    id: 'skiplink-footer',
    defaultMessage: 'Skip to footer',
  },
});

const SkipLinks = () => {
  const intl = useIntl();

  return (
    <nav
      class="nsw-skip"
      aria-label={intl.formatMessage(messages.skipLinksTitle)}
    >
      <a className="skiplink" href="#main-navigation">
        <span>{intl.formatMessage(messages.skipToNavigation)}</span>
      </a>
      <a className="skiplink" href="#page-document">
        <span>{intl.formatMessage(messages.skipToContent)}</span>
      </a>
      <a className="skiplink" href="#site-footer">
        <span>{intl.formatMessage(messages.footer)}</span>
      </a>
    </nav>
    // </div>
  );
};

export default SkipLinks;
