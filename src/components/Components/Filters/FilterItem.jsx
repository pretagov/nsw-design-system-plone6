function CollapsibleItem({ children }) {
  return (
    <>
      {/* <div className="nsw-filters__item-content">{children}</div> */}
      <button className="nsw-filters__item-button">
        <span className="nsw-filters__item-name">Keyword</span>
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

// Unused as search block doesn't have SSR as of Volto 16.30
function StaticItem({ children }) {
  return <div className="nsw-filters__item-content">{children}</div>;
}

export function FilterItem({ children }) {
  return (
    <>
      <div className="nsw-filters__item">
        <CollapsibleItem>{children}</CollapsibleItem>
      </div>
    </>
  );
}
