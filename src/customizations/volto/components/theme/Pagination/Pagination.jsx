import PropTypes from 'prop-types';
import React from 'react';

import { UniversalLink } from '@plone/volto/components';
import { FormattedMessage } from 'react-intl';
import { Menu } from 'semantic-ui-react';

const NumberedPage = ({ pageNumber, onClick, isCurrent = false }) => {
  return (
    <li>
      {/* TODO: This is awful markup. It's buttons disguised as links </3 */}
      <UniversalLink
        className={isCurrent ? 'active' : null}
        onClick={(e) => {
          onClick(e, { activePage: pageNumber });
        }}
        href="#"
        aria-disabled={isCurrent ? 'page' : null}
        data-value={pageNumber}
      >
        <span className="sr-only">Page </span>
        {pageNumber}
      </UniversalLink>
    </li>
  );
};

const Pagination = ({
  current,
  total,
  onChangePage,
  pageSize = null,
  pageSizes = [],
  onChangePageSize = null,
}) => {
  if (pageSize || pageSizes || onChangePageSize) {
    console.warn('Page sizes are currently not supported');
  }

  return (
    <nav className="nsw-pagination" aria-label="Pagination">
      <ul>
        {current > 1 ? (
          <li>
            <UniversalLink
              className="nsw-icon-button"
              href="#prev-page"
              onClick={(e) => {
                onChangePage(e, { activePage: current - 1 });
              }}
            >
              <span
                className="material-icons nsw-material-icons"
                focusable="false"
                aria-hidden="true"
              >
                keyboard_arrow_left
              </span>
              <span className="sr-only">Back</span>
            </UniversalLink>
          </li>
        ) : null}
        {current > 2 ? (
          <NumberedPage pageNumber={1} onClick={onChangePage} />
        ) : null}
        {current > 3 && (
          <li>
            <span>...</span>
          </li>
        )}
        {current > 1 ? (
          <NumberedPage pageNumber={current - 1} onClick={onChangePage} />
        ) : null}
        {current > 0 ? (
          <NumberedPage
            pageNumber={current}
            onClick={onChangePage}
            isCurrent={true}
          />
        ) : null}
        {total > 1 && current + 1 <= total ? (
          <NumberedPage pageNumber={current + 1} onClick={onChangePage} />
        ) : null}
        {total > current + 1 ? (
          <NumberedPage pageNumber={current + 2} onClick={onChangePage} />
        ) : null}
        {total > current + 2 ? (
          <NumberedPage pageNumber={current + 3} onClick={onChangePage} />
        ) : null}
        {total > current + 4 ? (
          <li>
            <span>...</span>
          </li>
        ) : null}
        {total > current + 3 ? (
          <NumberedPage pageNumber={total} onClick={onChangePage} />
        ) : null}
        {current < total - 1 ? (
          <li>
            <UniversalLink
              className="nsw-icon-button"
              href="#next-page"
              onClick={(e) => {
                onChangePage(e, { activePage: current + 1 });
              }}
            >
              <span
                className="material-icons nsw-material-icons"
                focusable="false"
                aria-hidden="true"
              >
                keyboard_arrow_right
              </span>
              <span className="sr-only">Next</span>
            </UniversalLink>
          </li>
        ) : null}
      </ul>
      {/* TODO: Changing page size with NSW design */}
      {pageSize && (
        <Menu>
          <Menu.Menu position="right">
            <Menu.Item>
              <FormattedMessage id="Show" defaultMessage="Show" />:
            </Menu.Item>
            {pageSizes.map((size) => (
              <Menu.Item
                key={size}
                value={size}
                active={size === pageSize}
                onClick={onChangePageSize}
              >
                {size}
              </Menu.Item>
            ))}
          </Menu.Menu>
        </Menu>
      )}
    </nav>
  );
};

Pagination.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  pageSizes: PropTypes.arrayOf(PropTypes.number),
  onChangePage: PropTypes.func.isRequired,
  onChangePageSize: PropTypes.func,
};

export default Pagination;
