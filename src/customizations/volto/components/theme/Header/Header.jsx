import loadable from '@loadable/component';
import {
  Anontools,
  Icon,
  LanguageSelector,
  Logo,
  SearchWidget,
  UniversalLink,
} from '@plone/volto/components';

import { Masthead } from 'nsw-design-system-plone6/components/Components/Masthead';
import { GoogleTranslateWarning } from 'nsw-design-system-plone6/components/GoogleTranslateWarning';
import { useIsClient } from 'nsw-design-system-plone6/hooks/useIsClient';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useGoogleAnalytics } from 'volto-google-analytics';
import { useIsTranslating } from 'volto-google-translate/helpers';
import Navigation from '../Navigation/Navigation';

import config from '@plone/volto/registry';
import { useVoltoSlotsEditor } from 'volto-slots-editor';

import MenuSVG from '@material-design-icons/svg/filled/menu.svg';
import SearchSVG from '@material-design-icons/svg/filled/search.svg';

import { Tabs } from 'nsw-design-system-plone6/components/Components/Tabs';

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

const SearchStartButton = ({ searchInputElement, onClick }) => {
  const isClient = useIsClient();
  return (
    <div className="nsw-header__search">
      {isClient ? (
        <button
          type="button"
          className="js-open-search"
          aria-expanded="false"
          aria-controls="header-search"
          ref={searchInputElement}
          onClick={onClick}
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
        <UniversalLink href="/search">
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
  const googleTranslateReady = useIsTranslating();
  const { siteSettings, siteTitle } = useSelector((state) => ({
    siteTitle: state.siteInfo.title,
    siteSettings: state.nswSiteSettings.data,
  }));
  const searchInputElement = useRef(null);
  const searchInputController = useRef(null);
  if (
    __CLIENT__ &&
    !searchInputController.current &&
    searchInputElement.current
  ) {
    loadable(() => import('nsw-design-system/src/components/header/header'), {
      ssr: false,
    })
      .load()
      .then((navigation) => {
        if (!searchInputController.current && searchInputElement.current) {
          searchInputController.current = new navigation.default(
            searchInputElement.current,
          );
          searchInputController.current.init();
        }
      });
  }
  useGoogleAnalytics();

  const beforeMastheadSlotData = useVoltoSlotsEditor('beforeMasthead');
  const BeforeMastheadSlotDisplay = config.getComponent({
    name: 'VoltoBlocksSlotDisplay',
  }).component;

  // TODO: Having state for this is ridiculous as it's only computed when it needs to be shown after clicking the search button
  const [headerOffset, setHeaderOffset] = useState(0);

  return (
    <>
      {/* TODO: Anon-tools and language selector currently don't work nor have a NSW component. Need to integrate. */}
      {/* <Anontools /> */}
      {siteSettings &&
      siteSettings.show_masthead !== undefined &&
      !siteSettings.show_masthead ? null : (
        <>
          {BeforeMastheadSlotDisplay &&
          beforeMastheadSlotData?.enabled === true ? (
            <BeforeMastheadSlotDisplay slot="beforeMasthead" />
          ) : null}
          <Masthead />
          {/* TODO: Make this injectable and not fixed */}
          {googleTranslateReady ? <GoogleTranslateWarning /> : null}
        </>
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
            <div className="pretagov-nsw-header-buttons">
              <MenuOpenButton />
              <SearchStartButton
                searchInputElement={searchInputElement}
                onClick={() => {
                  const searchButtonElement = document.querySelector(
                    '.nsw-header__search',
                  );
                  const searchInputElement = document.querySelector(
                    '.nsw-header__search-area',
                  );
                  // Copied media query from the CSS to account for mobile position being different
                  const isDesktop = window.matchMedia('(min-width: 62rem)')
                    .matches;
                  if (searchButtonElement && searchInputElement && isDesktop) {
                    const containerStart = searchInputElement.parentElement.getBoundingClientRect()
                      .right;
                    const offset =
                      containerStart -
                      searchButtonElement.getBoundingClientRect().right;
                    setHeaderOffset(offset);
                  }
                }}
              />
              <LanguageSelector />
            </div>
          </div>

          {/* This will only be the search input. The button to display the search input is still rendered by the header */}
          <SearchWidget
            searchInputController={searchInputController.current}
            positionOffset={headerOffset}
          />
        </div>
      </header>

      <Navigation />
      <Tabs
        tabItems={[
          {
            'title': 'New and existing homes',
            'urlHash': 'section1',
            'content': '<h2>New and existing homes</h2><p>As a first home buyer, you may be eligible for a <a href="https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty">transfer duty</a> concession or exemption.</p><ul><li>If your home is valued at less than $650,000, you can apply for a full exemption so that you don’t have to pay transfer duty.</li><li>If the value of your home is between $650,000 and $800,000, you can apply for a concessional rate of transfer duty. The amount you’ll have to pay will be based on the value of your home.</li></ul>'
          },
          {
            'title': 'Vacant land',
            'urlHash': 'section2',
            'content': '<h2>Vacant land</h2> <p>The FHBAS applies to vacant land on which you plan to build your home.</p><ul> <li>You won’t pay any <a href="https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty">transfer duty</a> if your land is valued at less than $350,000.</li><li>For land valued between $350,000 and $450,000, you’ll receive a concessional rate.</li></ul>'
          },
          {
            'title': 'Knockdown rebuild',
            'urlHash': 'section3',
            'content': '<h2>Knockdown rebuild</h2> <p>If you’re like many Sydney homeowners, you wish you had a more spacious and luxurious home. The problem is, you don’t want to give up your prized location!<br/>KnockDown Rebuild by Metricon gives you the best of both worlds.</p><p>You can have a gorgeous, modern home with plenty of space for your family – without giving up the location you love. All you have to do is demolish your existing dwelling and replace it with your dream Metricon home.</p>'
          },
        ]}
      />
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
