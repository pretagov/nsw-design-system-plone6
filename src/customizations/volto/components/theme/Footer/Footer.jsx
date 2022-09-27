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

const Footer = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { navItems, siteActions, subFooter } = useSelector((state) => ({
    navItems: state.navigation.items,
    siteActions: state.actions.actions.site_actions,
    subFooter: state.reduxAsyncConnect.subfooter,
  }));

  console.log(subFooter);

  useEffect(() => {
    dispatch(getNavigation(getBaseUrl(''), 2));
    dispatch(getSubFooter());
  }, [dispatch]);

  const lowerFooterLinks = subFooter.find(
    (links) => links.rootPath === 'Lower footer',
  );

  return (
    <>
      <footer id="site-footer" className="nsw-footer">
        {/* <div className="nsw-footer__upper">
          <div className="nsw-container">
            {navItems.map((item) => (
              <div key={item.url} className="nsw-footer__group">
                <div className="nsw-footer__heading">
                  <Link to={item.url}>{item.title}</Link>
                </div>
                {item.items ? (
                  <ul>
                    {item.items.map((subitem) => (
                      <li key={subitem.url}>
                        <Link to={subitem.url}>{subitem.title}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div> */}
        <div className="nsw-footer__lower">
          <div className="nsw-container">
            <p>{intl.formatMessage(messages.acknowledgementOfCountry)}</p>
            <hr />
            {lowerFooterLinks && lowerFooterLinks.items ? (
              <ul>
                {lowerFooterLinks.items.map(({ title, linkUrl }, index) => {
                  if (!linkUrl) {
                    return null;
                  }
                  let linkHref = linkUrl[0]['@id'];
                  linkHref = isInternalURL(linkHref)
                    ? flattenToAppURL(linkHref)
                    : linkHref;
                  return (
                    <li key={`lowerLinks-${index}`}>
                      <Link to={linkHref}>{title}</Link>
                    </li>
                  );
                })}
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
};

export default Footer;
