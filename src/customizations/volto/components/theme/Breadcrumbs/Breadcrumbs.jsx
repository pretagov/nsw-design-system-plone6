import { getBreadcrumbs } from '@plone/volto/actions';
import { getBaseUrl, hasApiExpander } from '@plone/volto/helpers';
import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

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
  const { items, root } = useSelector((state) => ({
    items: state.breadcrumbs.items,
    root: state.breadcrumbs.root,
  }));

  useEffect(() => {
    if (!hasApiExpander('breadcrumbs', getBaseUrl(pathname))) {
      dispatch(getBreadcrumbs(getBaseUrl(pathname)));
    }
  }, [pathname, dispatch]);

  if (pathname === '/') {
    return null;
  }

  return (
    <div className="nsw-container nsw-p-bottom-xs">
      <nav
        aria-label={intl.formatMessage(messages.breadcrumbs)}
        className="nsw-breadcrumbs"
      >
        <ol>
          <li>
            <Link to={root || '/'} title={intl.formatMessage(messages.home)}>
              Home
            </Link>
          </li>
          {items.map((item, index, items) => {
            return index === items.length - 1 ? (
              <li className="current" aria-current="page" key={item.url}>
                {item.title}
              </li>
            ) : (
              <li key={item.url}>
                <Link key={item.url} to={item.url}>
                  {item.title}
                </Link>
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
