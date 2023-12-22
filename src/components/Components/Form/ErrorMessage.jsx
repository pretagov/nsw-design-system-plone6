export function ErrorMessage({ inputId, message }) {
  return (
    <span
      class="nsw-form__helper nsw-form__helper--error"
      id={`${inputId}-error-text`}
    >
      <span
        class="material-icons nsw-material-icons"
        focusable="false"
        aria-hidden="true"
      >
        cancel
      </span>
      {message}
    </span>
  );
}
