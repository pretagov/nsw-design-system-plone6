import { getNavigation } from '@plone/volto/actions';
import {
  flattenToAppURL,
  getBaseUrl,
  isInternalURL,
} from '@plone/volto/helpers';
import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSubFooter } from 'volto-subfooter';

const messages = defineMessages({
  copyright: {
    id: 'Copyright',
    defaultMessage: 'Copyright © 2021',
  },
  acknowledgementOfCountry: {
    id: 'Acknowledgement Of Country',
    defaultMessage:
      'We pay respect to the Traditional Custodians and First Peoples of NSW, and acknowledge their continued connection to their country and culture.',
  },
  builtBy: {
    id: 'Built by',
    defaultMessage: 'Built by ',
  },
});

function Footer() {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { subFooter } = useSelector((state) => ({
    navItems: state.navigation.items,
    siteActions: state.actions.actions.site_actions,
    subFooter: state.reduxAsyncConnect.subfooter,
  }));

  useEffect(() => {
    dispatch(getNavigation(getBaseUrl(''), 2));
    dispatch(getSubFooter());
  }, [dispatch]);

  const lowerFooterLinksIndex = subFooter?.findIndex(
    (links) => links.rootPath === 'Lower footer',
  );
  const lowerFooterLinks = subFooter[lowerFooterLinksIndex];
  const upperFooterLinks = subFooter?.slice(lowerFooterLinksIndex + 1);

  return (
    <>
      <footer id="site-footer" className="nsw-footer">
        {upperFooterLinks ? (
          <div className="nsw-footer__upper">
            <div className="nsw-container">
              {upperFooterLinks.map((linkGroup) => {
                const headingItem = linkGroup.items[0];
                const groupItems = linkGroup.items.slice(1);

                let headingItemHref =
                  headingItem.linkUrl && headingItem.linkUrl[0]
                    ? headingItem.linkUrl[0]['@id']
                    : null;
                headingItemHref = headingItem.href
                  ? headingItem.href
                  : headingItemHref;
                headingItemHref = isInternalURL(headingItemHref)
                  ? flattenToAppURL(headingItemHref)
                  : headingItemHref;

                return (
                  <div
                    key={linkGroup['rootPath']}
                    className="nsw-footer__group"
                  >
                    <div className="nsw-footer__heading">
                      {headingItemHref ? (
                        <Link to={headingItemHref}>{headingItem.title}</Link>
                      ) : (
                        headingItem.title
                      )}
                    </div>
                    {groupItems ? (
                      <ul>
                        {/* TODO: There's tonnes of this volto-subform -> li logic around... component anyone? */}
                        {groupItems.map((subitem) => {
                          let subitemHref =
                            subitem.linkUrl && subitem.linkUrl[0]
                              ? subitem.linkUrl[0]['@id']
                              : null;
                          subitemHref = subitem.href
                            ? subitem.href
                            : subitemHref;
                          subitemHref = isInternalURL(subitemHref)
                            ? flattenToAppURL(subitemHref)
                            : subitemHref;
                          return (
                            <li>
                              {subitemHref ? (
                                <Link to={subitemHref}>{subitem.title}</Link>
                              ) : (
                                subitem.title
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        <div className="nsw-footer__lower">
          <div className="nsw-container">
            <p>{intl.formatMessage(messages.acknowledgementOfCountry)}</p>
            <hr />
            {lowerFooterLinks && lowerFooterLinks.items ? (
              <ul>
                {lowerFooterLinks.items.map(
                  ({ title, linkUrl, href }, index) => {
                    if (!linkUrl && !href) {
                      return <li key={`lowerLinks-${index}`}>{title}</li>;
                    }
                    let linkHref = href ? href : linkUrl[0]['@id'];
                    linkHref = isInternalURL(linkHref)
                      ? flattenToAppURL(linkHref)
                      : linkHref;
                    return (
                      <li key={`lowerLinks-${index}`}>
                        <Link to={linkHref}>{title}</Link>
                      </li>
                    );
                  },
                )}
              </ul>
            ) : null}
            <div className="nsw-footer__info">
              <div className="nsw-footer__copyright">
                {intl.formatMessage(messages.copyright)}
              </div>
              <div className="nsw-footer__built">
                {intl.formatMessage(messages.builtBy)}
                <a href="https://www.pretagov.com.au" rel="external noreferrer">
                  PretaGov
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
