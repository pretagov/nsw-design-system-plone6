import React, { useCallback, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { StyleWrapperView } from '@eeacms/volto-block-style/StyleWrapper';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import {
  getVariation,
  isTabEmpty,
  getParentTabFromHash,
} from '@eeacms/volto-tabs-block/helpers';
import { DefaultView } from './variations/default';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';

import config from '@plone/volto/registry';

import '@eeacms/volto-tabs-block/less/edit.less';
import '@eeacms/volto-tabs-block/less/tabs.less';

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

  const activeVariation = config.blocks.blocksConfig[
    TABS_BLOCK
  ].variations.filter((v, _i) => v.id === variation);

  const TabsView = activeVariation?.[0]?.view || DefaultView;

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
    <StyleWrapperView
      {...props}
      data={data}
      styleData={data.styles || {}}
      styled={true}
    >
      <div
        className={cx('tabs-block', variation, theme, verticalAlign)}
        id={props.id}
        ref={view}
      >
        <StyleWrapperView
          {...props}
          data={tabData}
          styleData={tabData.styles || {}}
          styled={true}
        >
          <TabsView
            {...props}
            tabIndex={0}
            activeTab={activeTab}
            activeTabIndex={activeTabIndex}
            node={view}
            metadata={metadata}
            parentRef={view}
            tabs={tabs}
            tabData={tabData}
            tabsData={tabsData}
            tabsList={tabsList}
            uiContainer={uiContainer}
            setActiveTab={handleActiveTabChange}
          />
        </StyleWrapperView>
      </div>
    </StyleWrapperView>
  );
};

export default compose(withScrollToTarget)(withRouter(View));
