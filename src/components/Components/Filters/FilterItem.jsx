import cx from 'classnames';
import { getTitleForFacet } from 'nsw-design-system-plone6/components/Components/Filters/helpers';
import { useIsClient } from 'nsw-design-system-plone6/hooks/useIsClient';
import * as React from 'react';

// Copied from nsw-design-system. Can't import due to Volto using CommonJS
// import { uniqueId } from 'nsw-design-system/src/global/scripts/helpers/utilities';
import { v4 as uuidv4 } from 'uuid';
export const uniqueId = (prefix) => {
  const prefixValue = prefix === undefined ? 'nsw' : prefix;
  const uuid = uuidv4();
  return `${prefixValue}-${uuid}`;
};

function hasValue(value) {
  // Sometimes `typeof` of an array gives object so we check outside of the switch. Don't ask me why....
  if (Array.isArray(value)) {
    return Boolean(
      value.filter((item) => ![null, undefined].includes(item)).length, // Exclude an array filled with `null`
    );
  }
  switch (typeof value) {
    case 'array':
      return Boolean(
        value.filter((item) => ![null, undefined].includes(item)).length, // Exclude an array filled with `null`
      );
    case 'object':
      return Boolean(Object.keys(value).length);
    default:
      return !!value;
  }
}

// TODO: Swap all font icons for SVG
function CollapsibleItem({ children, facet, value }) {
  const isClient = useIsClient();
  const uID = React.useRef(uniqueId('collapsed'));
  const [isOpen, setIsOpen] = React.useState(false);

  function handleAccordionClick() {
    setIsOpen((open) => !open);
  }

  const facetTitle = getTitleForFacet(facet);

  return (
    <>
      <button
        className={cx('nsw-filters__item-button', { active: isOpen })}
        type={isClient ? 'button' : null}
        aria-expanded={isClient ? (isOpen ? 'true' : 'false') : null}
        aria-controls={isClient ? uID.current : null}
        onClick={handleAccordionClick}
      >
        <span className="nsw-filters__item-name">
          {facetTitle}{' '}
          {hasValue(value) ? (
            <span
              class="material-icons nsw-material-icons nsw-material-icons--valid"
              focusable="false"
              aria-hidden="true"
            >
              check_circle
            </span>
          ) : null}
        </span>

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
        id={isClient ? uID.current : null}
        hidden={isClient && !isOpen ? true : null}
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
};

export function FilterItem({ children, facet, value }) {
  let ItemWrapper =
    displayModeComponentMapping[facet.displayMode] ?? StaticItem;

  if (facet.displayMode === 'hidden' || facet.hidden) {
    return null;
  }

  return (
    <div className="nsw-filters__item">
      <ItemWrapper facet={facet} value={value}>
        {children}
      </ItemWrapper>
    </div>
  );
}
