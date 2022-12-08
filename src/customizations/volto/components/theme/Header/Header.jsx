import loadable from '@loadable/component';
import {
  Anontools,
  Icon,
  LanguageSelector,
  Logo,
  SearchWidget,
  UniversalLink,
} from '@plone/volto/components';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useGoogleAnalytics } from 'volto-google-analytics';
import Navigation from '../Navigation/Navigation';
import { Masthead } from './Masthead';

import MenuSVG from '@material-design-icons/svg/filled/menu.svg';
import SearchSVG from '@material-design-icons/svg/filled/search.svg';

const MenuOpenButton = () => (
  <div className="nsw-header__menu">
    <button
      type="button"
      className="js-open-nav"
      aria-expanded="false"
      aria-controls="main-nav"
    >
      <Icon
        name={MenuSVG}
        className="material-icons nsw-material-icons"
        size="24px"
        ariaHidden={true}
      />
      <span>
        <span className="sr-only">Open</span> Menu
      </span>
    </button>
  </div>
);

const SearchStartButton = ({ searchInputElement }) => {
  return (
    <div className="nsw-header__search">
      {__CLIENT__ ? (
        <button
          type="button"
          className="js-open-search"
          aria-expanded="false"
          aria-controls="header-search"
          ref={searchInputElement}
        >
          <Icon
            name={SearchSVG}
            className="material-icons nsw-material-icons"
            size="36px"
            ariaHidden={true}
          />
          <span>
            <span className="sr-only">Show</span> Search
          </span>
        </button>
      ) : (
        // Below styling is only for buttons in the NSW Design System code unfortunately.
        <UniversalLink
          href="/search"
          style={{
            fontSize: 'var(--nsw-font-size-xxs-mobile)',
            lineHeight: 'var(--nsw-line-height-xxs-mobile)',
            fontWeight: 'var(--nsw-font-bold)',
            borderRadius: 'var(--nsw-border-radius)',
            textAlign: 'center',
            color: 'var(--nsw-brand-dark)',
            width: '3rem',
            height: '3rem',
            background: '0 0',
            border: '0',
            padding: '0',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name={SearchSVG}
            className="material-icons nsw-material-icons"
            size="36px"
            ariaHidden={true}
          />
          <span className="sr-only">Search</span>
        </UniversalLink>
      )}
    </div>
  );
};

const Header = ({ nswDesignSystem }) => {
  const { siteSettings, siteTitle } = useSelector((state) => ({
    siteTitle: state.siteInfo.title,
    siteSettings: state.nswSiteSettings.data,
  }));
  const { pathname } = useLocation();
  const searchInputElement = useRef(null);
  useEffect(() => {
    loadable(() => import('nsw-design-system/src/main'))
      .load()
      .then((nswDesignSystem) => {
        new nswDesignSystem['SiteSearch'](searchInputElement.current).init();
      });
  }, [searchInputElement]);
  useGoogleAnalytics();

  //   TODO: We should be able to use a fragment instead of a div here. Not sure why the `Navigation` component isn't being rendered if we use a fragment.
  return (
    <>
      {/* TODO: Anon-tools and language selector currently don't work nor have a NSW component. Need to integrate. */}
      {/* <Anontools /> */}
      {/* <LanguageSelector /> */}
      {siteSettings &&
      siteSettings.show_masthead !== undefined &&
      !siteSettings.show_masthead ? null : (
        <Masthead />
      )}

      <header className="nsw-header">
        <div className="nsw-header__container">
          <div className="nsw-header__inner">
            <div className="nsw-header__main">
              <div className="nsw-header__waratah">
                <Logo />
              </div>
              {siteSettings && !siteSettings.show_site_title_text ? null : (
                <div className="nsw-header__name">
                  <div className="nsw-header__title">{siteTitle}</div>
                </div>
              )}
            </div>
            <MenuOpenButton />
            <SearchStartButton searchInputElement={searchInputElement} />
          </div>

          {/* This will only be the search input. The button to display the search input is still rendered by the header */}
          <SearchWidget />
        </div>
      </header>

      <Navigation />
      {/* <Segment basic className="header-wrapper" role="banner">
        <Container>
          <div className="header">
            <div className="logo-nav-wrapper">
              <div className="logo">
                <Logo />
              </div>
              <Navigation pathname={pathname} />
            </div>
            <div className="tools-search-wrapper">
            </div>
          </div>
        </Container>
      </Segment> */}
    </>
  );
};

// export default injectLazyLibs(['nswDesignSystem'])(Header);
export default Header;
