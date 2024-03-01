import cx from 'classnames';
import { useIsClient } from 'nsw-design-system-plone6/hooks/useIsClient';
import { uniqueId } from 'nsw-design-system/src/global/scripts/helpers/utilities';
import * as React from 'react';

function CollapsibleItem({ children, facet, selected, onSelect }) {
  const isClient = useIsClient();
  const uID = uniqueId('collapsed');
  const [isOpen, setIsOpen] = React.useState();

  function handleAccordionClick() {
    onSelect(facet['@id']);
    setIsOpen(!isOpen);
  }

  return (
    <>
      <button
        className={cx('nsw-filters__item-button', { active: isOpen })}
        type={isClient ? 'button' : null}
        aria-expanded={isClient ? (isOpen ? 'true' : false) : null}
        aria-controls={isClient ? uID : null}
        onClick={handleAccordionClick}
      >
        {facet.title ? (
          <span className="nsw-filters__item-name">{facet.title}</span>
        ) : null}
        <span
          className="material-icons nsw-material-icons"
          focusable="false"
          aria-hidden="true"
        >
          keyboard_arrow_down
        </span>
      </button>
      <div
        className="nsw-filters__item-content"
        id={isClient ? uID : null}
        hidden={isClient && isOpen ? true : null}
      >
        {children}
      </div>
    </>
  );
}

function StaticItem({ children }) {
  return <div className="nsw-filters__item-content">{children}</div>;
}

const displayModeComponentMapping = {
  open: StaticItem,
  collapsed: CollapsibleItem,
  hidden: null,
};

export function FilterItem({ children, facet, selected, onSelect }) {
  const ItemWrapper =
    displayModeComponentMapping[facet?.displayMode] ?? StaticItem;

  return (
    <div className="nsw-filters__item">
      <ItemWrapper facet={facet} selected={selected} onSelect={onSelect}>
        {children}
      </ItemWrapper>
    </div>
  );
}