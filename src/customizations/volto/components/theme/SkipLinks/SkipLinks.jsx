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
        {intl.formatMessage(messages.skipToNavigation)}
      </a>
      <a className="skiplink" href="#page-document">
        {intl.formatMessage(messages.skipToContent)}
      </a>
      <a className="skiplink" href="#site-footer">
        {intl.formatMessage(messages.footer)}
      </a>
    </nav>
    // </div>
  );
};

export default SkipLinks;
