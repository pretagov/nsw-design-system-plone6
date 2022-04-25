import loadable from '@loadable/component';
import {
  Anontools,
  LanguageSelector,
  Logo,
  SearchWidget,
} from '@plone/volto/components';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import { Masthead } from './Masthead';

const MenuOpenButton = () => (
  <div className="nsw-header__menu">
    <button
      type="button"
      className="js-open-nav"
      aria-expanded="false"
      aria-controls="main-nav"
    >
      <span
        className="material-icons nsw-material-icons"
        focusable="false"
        aria-hidden="true"
      >
        menu
      </span>
      <span>
        <span className="sr-only">Open</span> Menu
      </span>
    </button>
  </div>
);

const SearchStartButton = ({ searchInputElement }) => {
  return (
    <div className="nsw-header__search">
      <button
        type="button"
        className="js-open-search"
        aria-expanded="false"
        aria-controls="header-search"
        ref={searchInputElement}
      >
        <span
          className="material-icons nsw-material-icons"
          focusable="false"
          aria-hidden="true"
        >
          search
        </span>
        <span>
          <span className="sr-only">Show</span> Search
        </span>
      </button>
    </div>
  );
};

const Header = ({ nswDesignSystem }) => {
  const { token, siteTitle } = useSelector((state) => ({
    token: state.userSession.token,
    siteTitle: state.siteInfo.title,
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

  //   TODO: We should be able to use a fragment instead of a div here. Not sure why the `Navigation` component isn't being rendered if we use a fragment.
  return (
    <div>
      {/* TODO: Anon-tools and language selector currently don't work nor have a NSW component. Need to integrate. */}
      {/* <Anontools /> */}
      {/* <LanguageSelector /> */}
      <Masthead />
      <header className="nsw-header">
        <div className="nsw-header__container">
          <div className="nsw-header__inner">
            <div className="nsw-header__main">
              <div className="nsw-header__waratah">
                <Logo />
              </div>
              <div className="nsw-header__name">
                <div className="nsw-header__title">{siteTitle}</div>
              </div>
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
    </div>
  );
};

// export default injectLazyLibs(['nswDesignSystem'])(Header);
export default Header;
