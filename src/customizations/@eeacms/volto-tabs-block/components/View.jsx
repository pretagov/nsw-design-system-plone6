/**
 * Shadowed from @eeacms/volto-tabs-block 9.1.0
 */
import { StyleWrapperView } from '@eeacms/volto-block-style/StyleWrapper';
import { DefaultView } from '@eeacms/volto-tabs-block/components/variations/default';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { getParentTabFromHash, getVariation, isTabEmpty } from '@eeacms/volto-tabs-block/helpers';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';
import cx from 'classnames';
import React, { useCallback, useEffect, useMemo } from 'react';
import { withRouter } from 'react-router';
import { compose } from 'redux';

import config from '@plone/volto/registry';

import '@eeacms/volto-tabs-block/less/edit.less';
import '@eeacms/volto-tabs-block/less/tabs.less';

import { Tabs } from 'nsw-design-system-plone6/components/Components/Tabs';

import loadable from '@loadable/component';

const View = (props) => {
  const view = React.useRef(null);
  const { data = {}, uiContainer = '', location, history } = props;
  const metadata = props.metadata || props.properties;
  const variation = getVariation(data);
  const tabsData = data.data || {};
  const tabs = tabsData.blocks || {};
  const tabsList = (tabsData.blocks_layout?.items || []).filter((tab) => {
    return data.hideEmptyTabs ? !isTabEmpty(tabs[tab]) : true;
  });
  const [activeTab, setActiveTab] = React.useState(tabsList?.[0]);
  const activeTabIndex = tabsList.indexOf(activeTab);
  const tabData = tabs[activeTab] || {};
  const theme = data.theme || 'light';
  const verticalAlign = data.verticalAlign || 'flex-start';

  const activeVariation = config.blocks.blocksConfig[TABS_BLOCK].variations.filter((v, _i) => v.id === variation);

  const TabsView = activeVariation?.[0]?.view || DefaultView;

  const tabController = React.useRef(null);
  const tabElementRef = React.useRef(null);
  if (__CLIENT__ && tabController.current === null && tabElementRef.current) {
    // Set it from null to false to ensure we only attempt to try the loadable once
    tabController.current = false;
    loadable(() => import('nsw-design-system/src/components/tabs/tabs'), {
      ssr: false,
    })
      .load()
      .then((tabsJs) => {
        if (!tabController.current && tabElementRef.current) {
          tabController.current = new tabsJs.default(tabElementRef.current);
          tabController.current.init();
        }
      })
      .catch((err) => {
        // Reset it back to null so we can re-attempt a loadable later
        tabController.current = null;
      });
  }

  const query = useMemo(() => {
    const { search } = location;

    return new URLSearchParams(search);
  }, [location]);
  const activeTabId = useMemo(() => query.get('activeTab'), [query]);

  const handleActiveTabChange = useCallback(
    (id) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('activeTab', id);

      history.push({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
      setActiveTab(id);
    },
    [history, location],
  );

  useEffect(() => {
    if (tabsList.includes(activeTabId)) {
      setActiveTab(activeTabId);
    }
  }, [activeTabId, tabsList]);

  useEffect(() => {
    const urlHash = props.location.hash.substring(1) || '';
    const parentTabId = getParentTabFromHash(data, urlHash);
    const id = parentTabId;
    const index = tabsList.indexOf(id);
    const parentId = data.id || props.id;
    const parent = document.getElementById(parentId);
    const headerWrapper = document.querySelector('.header-wrapper');
    const offsetHeight = headerWrapper?.offsetHeight || 0;
    if (id !== parentId && index > -1 && parent) {
      if (activeTabIndex !== index) {
        setActiveTab(id);
      }
      setTimeout(() => {
        const scrollToElement = document.getElementById(urlHash);
        //TODO: volto now uses react-router-hash-link which automatically scrolls to offset 0
        props.scrollToTarget(scrollToElement, offsetHeight);
      }, 10);
    } else if (id === parentId && parent) {
      props.scrollToTarget(parent, offsetHeight);
    }
    /* eslint-disable-next-line */
  }, []);

  return (
    <Tabs
      ref={tabElementRef}
      tabItems={[
        {
          title: 'New and existing homes',
          urlHash: 'section1',
          content: '<h2>New and existing homes</h2><p>As a first home buyer, you may be eligible for a <a href="https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty">transfer duty</a> concession or exemption.</p><ul><li>If your home is valued at less than $650,000, you can apply for a full exemption so that you don’t have to pay transfer duty.</li><li>If the value of your home is between $650,000 and $800,000, you can apply for a concessional rate of transfer duty. The amount you’ll have to pay will be based on the value of your home.</li></ul>',
        },
        {
          title: 'Vacant land',
          urlHash: 'section2',
          content: '<h2>Vacant land</h2> <p>The FHBAS applies to vacant land on which you plan to build your home.</p><ul> <li>You won’t pay any <a href="https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty">transfer duty</a> if your land is valued at less than $350,000.</li><li>For land valued between $350,000 and $450,000, you’ll receive a concessional rate.</li></ul>',
        },
        {
          title: 'Knockdown rebuild',
          urlHash: 'section3',
          content: '<h2>Knockdown rebuild</h2> <p>If you’re like many Sydney homeowners, you wish you had a more spacious and luxurious home. The problem is, you don’t want to give up your prized location!<br/>KnockDown Rebuild by Metricon gives you the best of both worlds.</p><p>You can have a gorgeous, modern home with plenty of space for your family – without giving up the location you love. All you have to do is demolish your existing dwelling and replace it with your dream Metricon home.</p>',
        },
      ]}
    />
    // <StyleWrapperView
    //   {...props}
    //   data={data}
    //   styleData={data.styles || {}}
    //   styled={true}
    // >
    //   <div
    //     className={cx('tabs-block', variation, theme, verticalAlign)}
    //     id={props.id}
    //     ref={view}
    //   >
    //     <StyleWrapperView
    //       {...props}
    //       data={tabData}
    //       styleData={tabData.styles || {}}
    //       styled={true}
    //     >
    //       <TabsView
    //         {...props}
    //         tabIndex={0}
    //         activeTab={activeTab}
    //         activeTabIndex={activeTabIndex}
    //         node={view}
    //         metadata={metadata}
    //         parentRef={view}
    //         tabs={tabs}
    //         tabData={tabData}
    //         tabsData={tabsData}
    //         tabsList={tabsList}
    //         uiContainer={uiContainer}
    //         setActiveTab={handleActiveTabChange}
    //       />
    //     </StyleWrapperView>
    //   </div>
    // </StyleWrapperView>
  );
};

export default compose(withScrollToTarget)(withRouter(View));
