export function EmbedContentViewWrapper({ children }) {
  return (
    <div className="nsw-container">
      <div className="nsw-layout">
        <div className="nsw-layout__main">{children}</div>
      </div>
    </div>
  );
}
