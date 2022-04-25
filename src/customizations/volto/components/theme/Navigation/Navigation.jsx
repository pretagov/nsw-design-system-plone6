import loadable from '@loadable/component';
import { UniversalLink as Link } from '@plone/volto/components';
import React, { useEffect, useMemo, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const getItemUrl = (item) => {
  return item.url || item['@id'] || '';
};

const messages = defineMessages({
  mobileMenuTitle: {
    id: 'Mobile menu title',
    defaultMessage: 'Menu',
  },
  mobileMenuAccessibleLabel: {
    id: 'Mobile menu accessible label',
    defaultMessage: 'Main menu',
  },
  closeMobileMenu: {
    id: 'Close menu',
    defaultMessage: 'Close menu',
  },
  openMobileMenu: {
    id: 'Open menu',
    defaultMessage: 'Open menu',
  },
});

const SimpleNavItemContents = ({ title, url }) => {
  return (
    <Link href={url === '' ? '/' : url}>
      <span>{title}</span>
    </Link>
  );
};

const MainNavItem = ({ item }) => {
  const itemTitle = item.title;
  const itemLink = getItemUrl(item);
  const isMegaMenu = item.items.length > 0;
  const navSubmenuId = `sub-nav-${itemTitle.replace(/ /g, '')}`;

  if (!isMegaMenu) {
    return <SimpleNavItemContents title={item.title} url={itemLink} />;
  }

  return (
    <>
      <Link href={itemLink}>
        <span>{itemTitle}</span>
        <span
          className="material-icons nsw-material-icons"
          focusable="false"
          aria-hidden="true"
        >
          keyboard_arrow_right
        </span>
      </Link>

      {/* TODO: i18n messages for submenu labels */}
      <div
        className="nsw-main-nav__sub-nav"
        id={navSubmenuId}
        role="region"
        aria-label="About DPC Submenu"
      >
        <div className="nsw-main-nav__header">
          <button
            className="nsw-icon-button nsw-icon-button--flex js-close-sub-nav"
            type="button"
            aria-expanded="true"
            aria-controls={navSubmenuId}
          >
            <span
              className="material-icons nsw-material-icons"
              focusable="false"
              aria-hidden="true"
            >
              keyboard_arrow_left
            </span>
            <span>
              Back<span className="sr-only"> to previous menu</span>
            </span>
          </button>

          <button
            className="nsw-icon-button js-close-nav"
            type="button"
            aria-expanded="true"
          >
            <span
              className="material-icons nsw-material-icons"
              focusable="false"
              aria-hidden="true"
            >
              close
            </span>
            <span className="sr-only">Close Menu</span>
          </button>
        </div>

        <div className="nsw-main-nav__title">
          <Link href={itemLink}>
            <span>{itemTitle}</span>
            <span
              className="material-icons nsw-material-icons"
              focusable="false"
              aria-hidden="true"
            >
              east
            </span>
          </Link>
        </div>

        <div className="nsw-main-nav__description">{item.description}</div>

        <ul className="nsw-main-nav__sub-list">
          {item.items.map((subItem) => {
            return (
              <li key={subItem.title}>
                <SimpleNavItemContents
                  title={subItem.title}
                  url={getItemUrl(subItem)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

const Navigation = () => {
  const intl = useIntl();
  const location = useLocation();
  const { items } = useSelector((state) => ({
    token: state.userSession.token,
    items: state.reduxAsyncConnect.navigation?.items || state.navigation?.items,
    lang: state.intl.locale,
  }));

  const navigationController = useRef(null);
  if (__CLIENT__ && !navigationController.current) {
    loadable(
      () => import('nsw-design-system/src/components/main-nav/main-nav'),
      { ssr: false },
    )
      .load()
      .then((navigation) => {
        if (!navigationController.current) {
          navigationController.current = new navigation.default();
          navigationController.current.init();
        }
      });
  }

  useEffect(() => {
    if (
      navigationController.current &&
      navigationController.current.openSubNavElements.length > 0
    ) {
      navigationController.current.closeSubNav();
    }
  }, [location]);

  return useMemo(() => {
    return (
      <nav
        className="nsw-main-nav js-mega-menu"
        id="main-nav"
        aria-label={intl.formatMessage(messages.mobileMenuAccessibleLabel)}
      >
        <div className="nsw-main-nav__header">
          <div className="nsw-main-nav__title">
            {intl.formatMessage(messages.mobileMenuTitle)}
          </div>
          <button
            className="nsw-icon-button js-close-nav"
            type="button"
            aria-expanded="true"
          >
            <span
              className="material-icons nsw-material-icons"
              focusable="false"
              aria-hidden="true"
            >
              close
            </span>
            <span className="sr-only">
              {intl.formatMessage(messages.closeMobileMenu)}
            </span>
          </button>
        </div>
        <ul className="nsw-main-nav__list">
          {items.map((item) => {
            return (
              <li key={getItemUrl(item)}>
                <MainNavItem item={item} />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }, [intl, items]);
};

export default Navigation;
