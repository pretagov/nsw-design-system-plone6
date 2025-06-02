export function GoogleTranslateWarning(props) {
  return (
    <div
      className="nsw-in-page-alert nsw-in-page-alert--warning nsw-in-page-alert--compact"
      style={{ marginBlockStart: '0px' }}
    >
      <div className="nsw-container" style={{ display: 'flex' }}>
        <span
          focusable="false"
          aria-hidden="true"
          className="material-icons nsw-material-icons nsw-in-page-alert__icon"
        >
          error
        </span>
        <div className="nsw-in-page-alert__content">
          <p>
            Our website uses an automatic service to translate our content into
            different languages. These translations should be used as a guide
            only.
          </p>
        </div>
      </div>
    </div>
  );
}
