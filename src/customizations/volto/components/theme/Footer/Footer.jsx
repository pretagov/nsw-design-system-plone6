import { Icon } from '@plone/volto/components';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';
import { getTextColourUtilityForPaletteName } from 'nsw-design-system-plone6/helpers';
import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSubFooter } from 'volto-subfooter';

// TODO: Would dynamically importing these reduce bundle size?
import FacebookSVG from '@mdi/svg/svg/facebook.svg';
import LinkedInSVG from '@mdi/svg/svg/linkedin.svg';
import TwitterSVG from '@mdi/svg/svg/twitter.svg';
import YouTubeSVG from '@mdi/svg/svg/youtube.svg';

const messages = defineMessages({
  copyright: {
    id: 'Copyright',
    defaultMessage: 'Copyright',
  },
  acknowledgementOfCountry: {
    id: 'Acknowledgement Of Country',
    defaultMessage:
      'We pay respect to the Traditional Custodians and First Peoples of NSW, and acknowledge their continued connection to their country and culture.',
  },
  builtWith: {
    id: 'Built with',
    defaultMessage: 'Built with ',
  },
});

const socialFieldIconMapping = {
  twitter_username: {
    href: (strings, username) => `https://www.twitter.com/${username}`,
    socialName: 'Twitter',
    Logo: TwitterSVG,
  },
  facebook_username: {
    href: (strings, username) => `https://www.facebook.com/${username}`,
    socialName: 'Facebook',
    Logo: FacebookSVG,
  },
  linkedin_url: {
    href: (strings, url) => url,
    socialName: 'LinkedIn',
    Logo: LinkedInSVG,
  },
  youtube_url: {
    href: (strings, url) => url,
    socialName: 'YouTube',
    Logo: YouTubeSVG,
  },
};

function Footer() {
  const intl = useIntl();
  const dispatch = useDispatch();
  const subFooter = useSelector((state) => state.subFooter?.result);
  const siteSettings = useSelector((state) => state.nswSiteSettings.data);
  const SlotDisplay = config.getComponent({
    name: 'VoltoBlocksSlotDisplay',
  }).component;

  useEffect(() => {
    dispatch(getSubFooter());
  }, [dispatch]);

  const lowerFooterLinksIndex = subFooter?.findIndex(
    (links) => links.rootPath === 'Lower footer',
  );
  const lowerFooterLinks =
    lowerFooterLinksIndex >= 0 ? subFooter[lowerFooterLinksIndex] : [];

  const upperFooterLinks = subFooter?.filter(
    (item, index) => index !== lowerFooterLinksIndex,
  );

  const socialFieldsToDisplay = Object.keys(socialFieldIconMapping).filter(
    (fieldname) =>
      siteSettings && siteSettings[fieldname] && !!siteSettings[fieldname],
  );
  const acknowledgementOfCountry =
    siteSettings?.acknowledgement_of_country ||
    intl.formatMessage(messages.acknowledgementOfCountry);

  const upperFooterColour = siteSettings?.nsw_independent_upper_footer_colour;
  const upperFooterTextColour = getTextColourUtilityForPaletteName(
    upperFooterColour,
  );

  return (
    <>
      <footer id="site-footer" className="nsw-footer">
        {(upperFooterLinks && upperFooterLinks.length > 0) || SlotDisplay ? (
          <div
            className={cx('nsw-footer__upper', {
              [upperFooterTextColour]: true,
              [`nsw-bg--${upperFooterColour}`]: true,
            })}
          >
            {SlotDisplay ? <SlotDisplay slot="footer" /> : null}
            <div className="nsw-container">
              {upperFooterLinks.map((linkGroup) => {
                const headingItem = linkGroup.items[0];

                if (!headingItem) {
                  return null;
                }

                const groupItems = linkGroup.items.slice(1);

                let headingItemHref = headingItem.href
                  ? headingItem.href
                  : headingItem.linkUrl && headingItem.linkUrl[0]
                  ? headingItem.linkUrl[0]['@id']
                  : null;
                headingItemHref = headingItemHref = isInternalURL(
                  headingItemHref,
                )
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
                        {groupItems.map(
                          ({ title, linkUrl, href, visible }, index) => {
                            if (visible === false) {
                              return null;
                            }
                            const key = `${linkGroup['rootPath']}-lowerLinks-${index}`;
                            if (!linkUrl && !href) {
                              return <li key={key}>{title}</li>;
                            }
                            let linkHref = href ? href : linkUrl[0]?.['@id'];
                            linkHref = isInternalURL(linkHref)
                              ? flattenToAppURL(linkHref)
                              : linkHref;
                            return (
                              <li key={key}>
                                <Link to={linkHref}>{title}</Link>
                              </li>
                            );
                          },
                        )}
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
            {siteSettings?.show_acknowledgement_of_country === false ? null : (
              <>
                <p>{acknowledgementOfCountry}</p>
                <hr />
              </>
            )}
            <div className="nsw-footer__links">
              {lowerFooterLinks && lowerFooterLinks.items ? (
                <ul>
                  {lowerFooterLinks.items.map(
                    ({ title, linkUrl, href, visible }, index) => {
                      if (visible === false) {
                        return null;
                      }
                      if (!linkUrl && !href) {
                        return <li key={`lowerLinks-${index}`}>{title}</li>;
                      }
                      let linkHref = href ? href : linkUrl[0]?.['@id'];
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
              {socialFieldsToDisplay.length > 0 ? (
                <div className="nsw-footer__social">
                  {socialFieldsToDisplay.map((fieldname) => {
                    const username = siteSettings[fieldname];
                    const { href, socialName, Logo } = socialFieldIconMapping[
                      fieldname
                    ];

                    return (
                      <a
                        key={fieldname}
                        className="nsw-icon-button"
                        href={href`${username}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <Icon name={Logo} size="36px" color="white" />
                        <span className="sr-only">{socialName}</span>
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className="nsw-footer__info">
              <div className="nsw-footer__copyright">
                {`${intl.formatMessage(
                  messages.copyright,
                )} © ${new Date().getFullYear()}`}
              </div>
              <div className="nsw-footer__built">
                {intl.formatMessage(messages.builtWith)}
                <a href="https://digitalnsw.pretagov.com.au" rel="external">
                  Plone 6 NSW DS
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
