import loadable from '@loadable/component';
import { getNavigation } from '@plone/volto/actions';
import { Icon, UniversalLink as Link } from '@plone/volto/components';
import { getBaseUrl } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import React, { useEffect, useMemo, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import CloseSVG from '@material-design-icons/svg/filled/close.svg';
import EastSVG from '@material-design-icons/svg/filled/east.svg';
import KeyboardArrowLeftSVG from '@material-design-icons/svg/filled/keyboard_arrow_left.svg';
import KeyboardArrowRightSVG from '@material-design-icons/svg/filled/keyboard_arrow_right.svg';

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
        <Icon
          name={KeyboardArrowRightSVG}
          className="material-icons nsw-material-icons"
          size="24px"
          ariaHidden={true}
        />
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
            <Icon
              name={KeyboardArrowLeftSVG}
              className="material-icons nsw-material-icons"
              size="24px"
              ariaHidden={true}
            />
            <span>
              Back<span className="sr-only"> to previous menu</span>
            </span>
          </button>

          <button
            className="nsw-icon-button js-close-nav"
            type="button"
            aria-expanded="true"
          >
            <Icon
              name={CloseSVG}
              className="material-icons nsw-material-icons"
              size="24px"
              ariaHidden={true}
            />
            <span className="sr-only">Close Menu</span>
          </button>
        </div>

        <div className="nsw-main-nav__title">
          <Link href={itemLink}>
            <span>{itemTitle}</span>
            <Icon
              name={EastSVG}
              className="material-icons nsw-material-icons"
              size="24px"
              ariaHidden={true}
            />
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
  const dispatch = useDispatch();
  const location = useLocation();
  const items = useSelector(
    (state) => state.navigation?.items || state.navigation?.items,
  );
  const root = useSelector((state) => state.breadcrumbs.root);
  const token = useSelector((state) => state.userSession.token);
  const lang = useSelector((state) => state.intl.locale);

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
      navigationController.current.mobileHideMainNav({ propertyName: '' });
    }
  }, [location]);
  useEffect(() => {
    dispatch(
      getNavigation(getBaseUrl(location.pathname), config.settings.navDepth),
    );
  }, [token, dispatch, location.pathname]);

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
            <Icon
              name={CloseSVG}
              className="material-icons nsw-material-icons"
              size="24px"
              ariaHidden={true}
            />
            <span className="sr-only">
              {intl.formatMessage(messages.closeMobileMenu)}
            </span>
          </button>
        </div>
        <ul className="nsw-main-nav__list">
          {items.map((item) => {
            if (getItemUrl(item) === root) {
              return null;
            }
            return (
              <li key={getItemUrl(item)}>
                <MainNavItem item={item} />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }, [intl, items, root]);
};

export default Navigation;
