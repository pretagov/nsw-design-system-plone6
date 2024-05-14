export function GlobalAlert({ title, description, buttonText, link }) {
  <div class="nsw-global-alert js-global-alert" role="alert">
    <div class="nsw-global-alert__wrapper">
      <div class="nsw-global-alert__content">
        <div class="nsw-global-alert__title">{title}</div>
        {description ? <p>{description}</p> : null}
      </div>
      {buttonText && link ? (
        <p>
          <a href={link} class="nsw-button nsw-button--white">
            {buttonText}
          </a>
        </p>
      ) : null}
      <button class="nsw-icon-button js-close-alert" type="button" aria-expanded="true">
        <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">
          close
        </span>
        <span class="sr-only">Close message</span>
      </button>
    </div>
  </div>;
}
