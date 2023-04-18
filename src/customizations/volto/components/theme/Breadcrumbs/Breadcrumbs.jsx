import { getBreadcrumbs } from '@plone/volto/actions';
import { UniversalLink } from '@plone/volto/components';
import { getBaseUrl, hasApiExpander } from '@plone/volto/helpers';
import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const messages = defineMessages({
  home: {
    id: 'Home',
    defaultMessage: 'Home',
  },
  breadcrumbs: {
    id: 'Breadcrumbs',
    defaultMessage: 'My Breadcrumbs',
  },
});

const Breadcrumbs = () => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const root = useSelector((state) => state.breadcrumbs?.root);
  const items = useSelector((state) => state.breadcrumbs?.items);
  const breadcrumbStartDepth = useSelector(
    (state) => state.nswSiteSettings?.data?.breadcrumb_start_depth,
  );
  const siteDepth = useSelector(
    (state) => state.nswSiteSettings?.data?.site_depth,
  );

  useEffect(() => {
    if (!hasApiExpander('breadcrumbs', getBaseUrl(pathname))) {
      dispatch(getBreadcrumbs(getBaseUrl(pathname)));
    }
  }, [pathname, dispatch]);

  if (pathname === '/') {
    return null;
  }

  if (breadcrumbStartDepth && siteDepth < breadcrumbStartDepth) {
    return null;
  }

  return (
    <div className="nsw-container">
      <nav
        aria-label={intl.formatMessage(messages.breadcrumbs)}
        className="nsw-breadcrumbs"
      >
        <ol>
          <li>
            <UniversalLink
              href={root || '/'}
              title={intl.formatMessage(messages.home)}
            >
              Home
            </UniversalLink>
          </li>
          {items.map((item, index, items) => {
            return index === items.length - 1 ? (
              <li className="current" aria-current="page" key={item.url}>
                {item.title}
              </li>
            ) : (
              <li key={item.url}>
                <UniversalLink href={item.url}>{item.title}</UniversalLink>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
export { Breadcrumbs };
