function CollapsibleItem({ children, facet }) {
  return (
    <>
      <button className="nsw-filters__item-button">
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
      <div className="nsw-filters__item-content">{children}</div>
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

export function FilterItem({ children, facet, ...props }) {
  const ItemWrapper =
    displayModeComponentMapping[facet?.displayMode] ?? StaticItem;

  return (
    <div className="nsw-filters__item">
      <ItemWrapper facet={facet}>{children}</ItemWrapper>
    </div>
  );
}
