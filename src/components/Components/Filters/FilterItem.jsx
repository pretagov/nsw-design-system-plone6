import { useIsClient } from 'nsw-design-system-plone6/hooks/useIsClient';

function CollapsibleItem({ children }) {
  debugger;
  return (
    <>
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
function StaticItem({ children }) {
  return <div className="nsw-filters__item-content">{children}</div>;
}

export function FilterItem({ children, ...props }) {
  // We might need to dynamically do the `js-ready` version in here (only on the client though!)

  const isClient = useIsClient();

  console.log('props', props);

  return (
    <>
      <div className="nsw-filters__item">
        {isClient ? (
          <CollapsibleItem>{children}</CollapsibleItem>
        ) : (
          <StaticItem>{children}</StaticItem>
        )}
      </div>
    </>
  );
}
