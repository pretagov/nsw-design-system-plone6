/**
 * Home container.
 * @module components/theme/NotFound/NotFound
 *
 * Removed Semantic-UI Container and replaced with nsw-layout
 * Changed message to not mention "links below"
 * Added `useSelector`, useIntl, defineMessages and `Helmet` import
 * Ensure the page has a valid title tag
 */

import { Helmet } from '@plone/volto/helpers';
import { withServerErrorCode } from '@plone/volto/helpers/Utils/Utils';
import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const messages = defineMessages({
  pageTitle: {
    id: 'Page not found',
    defaultMessage: 'Page not found',
  },
  pageTitleWithSiteName: {
    id: 'Page not found - {siteTitle}',
    defaultMessage: 'Page not found - {siteTitle}',
  },
});

/**
 * Not found function.
 * @function NotFound
 * @returns {string} Markup of the not found page.
 */
const NotFound = () => {
  const intl = useIntl();
  const siteTitle = useSelector((state) => state.siteInfo.title);

  return (
    <>
      <Helmet
        title={
          siteTitle
            ? intl.formatMessage(messages.pageTitleWithSiteName, {
                siteTitle: siteTitle,
              })
            : intl.formatMessage(messages.pageTitle)
        }
      />
      <div className="nsw-container">
        <div className="nsw-layout">
          <div className="nsw-layout__main">
            <h1>
              <FormattedMessage
                id="This page does not seem to exist…"
                defaultMessage="This page does not seem to exist…"
              />
            </h1>
            <p className="description">
              <FormattedMessage
                id="We apologize for the inconvenience, but the page you were trying to access is not at this address."
                defaultMessage="We apologize for the inconvenience, but the page you were trying to access is not at this address."
              />
            </p>
            <p>
              <FormattedMessage
                id="If you are certain you have the correct web address but are encountering an error, please contact the {site_admin}."
                defaultMessage="If you are certain you have the correct web address but are encountering an error, please contact the {site_admin}."
                values={{
                  site_admin: (
                    <Link to="/contact-form">
                      <FormattedMessage
                        id="Site Administration"
                        defaultMessage="Site Administration"
                      />
                    </Link>
                  ),
                }}
              />
            </p>
            <p>
              <FormattedMessage id="Thank you." defaultMessage="Thank you." />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default withServerErrorCode(404)(NotFound);
