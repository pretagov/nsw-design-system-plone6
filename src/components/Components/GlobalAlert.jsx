export function GlobalAlert({ title, description, buttonText, url }) {
  return (
    <div className="nsw-global-alert js-global-alert" role="alert">
      <div className="nsw-global-alert__wrapper">
        <div className="nsw-global-alert__content">
          <div className="nsw-global-alert__title">{title ?? 'placeholder'}</div>
          {description ? <p>{description}</p> : null}
        </div>
        {buttonText && url ? (
          <p>
            <a href={url} className="nsw-button nsw-button--white">
              {buttonText}
            </a>
          </p>
        ) : null}
        <button className="nsw-icon-button js-close-alert" type="button" aria-expanded="true">
          <span className="material-icons nsw-material-icons" focusable="false" aria-hidden="true">
            close
          </span>
          <span className="sr-only">Close message</span>
        </button>
      </div>
    </div>
  );
}
