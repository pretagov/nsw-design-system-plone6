import { Icon, UniversalLink } from '@plone/volto/components';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';
import { getTextColourUtilityForPaletteName } from 'nsw-design-system-plone6/helpers';
import { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useVoltoSlotsEditor } from 'volto-slots-editor';
import { getSubFooter } from 'volto-subfooter';

import { DesignSystemVersionInformation } from 'nsw-design-system-plone6/components/DesignSystemVersionInformation';

// TODO: Would dynamically importing these reduce bundle size?
import MailSVG from '@mdi/svg/svg/email.svg';
import FacebookSVG from '@mdi/svg/svg/facebook.svg';
import InstagramSVG from '@mdi/svg/svg/instagram.svg';
import LinkedInSVG from '@mdi/svg/svg/linkedin.svg';
import TwitterSVG from '@mdi/svg/svg/twitter.svg';
import WeChatSVG from '@mdi/svg/svg/wechat.svg';
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
  facebook_username: {
    href: (strings, username) => `https://www.facebook.com/${username}`,
    socialName: 'Facebook',
    Logo: FacebookSVG,
  },
  instagram_url: {
    href: (strings, url) => url,
    socialName: 'Instagram',
    Logo: InstagramSVG,
  },
  linkedin_url: {
    href: (strings, url) => url,
    socialName: 'LinkedIn',
    Logo: LinkedInSVG,
  },
  mail_link: {
    href: (strings, address) => `mailto:${address}`,
    socialName: 'Email',
    Logo: MailSVG,
  },
  twitter_username: {
    href: (strings, username) => `https://www.twitter.com/${username}`,
    socialName: 'Twitter',
    Logo: TwitterSVG,
  },
  we_chat_url: {
    href: (strings, url) => url,
    socialName: 'WeChat',
    Logo: WeChatSVG,
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
  const aocSlotData = useVoltoSlotsEditor('aoc');
  const AocSlotDisplay = config.getComponent({
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
  const aocFooterColour = siteSettings?.nsw_independent_aoc_colour;
  const aocTextColour = getTextColourUtilityForPaletteName(aocFooterColour);

  return (
    <>
      <footer id="site-footer" className="nsw-footer">
        {upperFooterLinks && upperFooterLinks.length > 0 ? (
          <div
            className={cx('nsw-footer__upper', {
              [upperFooterTextColour]: true,
              [`nsw-bg--${upperFooterColour}`]: true,
            })}
          >
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
                        <UniversalLink href={headingItemHref}>
                          {headingItem.title}
                        </UniversalLink>
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
                                <UniversalLink href={linkHref}>
                                  {title}
                                </UniversalLink>
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
        {AocSlotDisplay && aocSlotData?.enabled === true ? (
          <div
            className={cx('nsw-ds-footer__aoc', {
              [aocTextColour]: !!aocTextColour,
              [`nsw-bg--${aocFooterColour}`]: !!aocFooterColour,
            })}
          >
            <div className="nsw-container">
              <AocSlotDisplay slot="aoc" />
            </div>
          </div>
        ) : null}
        <div className="nsw-footer__lower">
          <div className="nsw-container">
            {aocSlotData?.enabled === true ||
            siteSettings?.show_acknowledgement_of_country === false ? null : (
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
                          <UniversalLink href={linkHref}>{title}</UniversalLink>
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
                  <DesignSystemVersionInformation />
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
