/**
 * Shadowed from @eeacms/volto-tabs-block 9.1.0
 * Removed all the current tab handling functionality as it's handled by the NSW JS
 * Removed all the scrolling behaviour as it's handled by the NSW JS
 * Added props `onTabClick` and `onTabDoubleClick`
 */
import { isTabEmpty } from '@eeacms/volto-tabs-block/helpers';
import { RenderBlocks } from '@plone/volto/components';
import React from 'react';
import { Tabs } from 'nsw-design-system-plone6/components/Components/Tabs';
import loadable from '@loadable/component';

export default function View({ data, onTabClick, onTabDoubleClick }) {
  const tabsData = data.data || {};
  const tabs = tabsData.blocks || {};
  const tabsList = (tabsData.blocks_layout?.items || []).filter((tab) => {
    return data.hideEmptyTabs ? !isTabEmpty(tabs[tab]) : true;
  });

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

  return (
    <Tabs
      title={data.title}
      ref={tabElementRef}
      tabItems={[
        ...tabsList.map((tabId) => {
          return {
            title: tabs[tabId].title,
            urlHash: tabId,
            content: <RenderBlocks content={tabs[tabId]} />,
          };
        }),
      ]}
      onTabClick={onTabClick}
      onTabDoubleClick={onTabDoubleClick}
    />
  );
}
