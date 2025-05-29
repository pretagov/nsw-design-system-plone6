import { Select } from 'nsw-design-system-plone6/components/Components/Form/Select';
import { useEffect } from 'react';

function createTranslationAlert(e) {
  const alertClassName = 'nsw-in-page-alert';
  const alertElement = document.createElement('div');
  alertElement.classList.add(
    alertClassName,
    `${alertClassName}--warning`,
    `${alertClassName}--compact`,
  );
  alertElement.style.marginBlockStart = 0;

  const alertWrapper = document.createElement('div');
  alertWrapper.classList.add('nsw-container');
  alertWrapper.style.display = 'flex';
  alertElement.appendChild(alertWrapper);

  const alertIcon = document.createElement('span');
  alertIcon.setAttribute('focusable', false);
  alertIcon.setAttribute('aria-hidden', true);
  alertIcon.classList.add(
    'material-icons',
    'nsw-material-icons',
    'nsw-in-page-alert__icon',
  );
  alertIcon.innerText = 'error';
  alertWrapper.appendChild(alertIcon);

  const alertBody = document.createElement('div');
  alertBody.classList.add(`${alertClassName}__content`);
  alertBody.innerHTML =
    '<p>Our website uses an automatic service to translate our content into different languages. These translations should be used as a guide only.</p>';
  alertWrapper.appendChild(alertBody);

  return alertElement;
}

function injectTranslateScript() {
  window.translateInit = translateInit;
  const widgetSource =
    'https://translate.google.com/translate_a/element.js?cb=window.translateInit';
  if (!document.querySelector(`script[src="${widgetSource}"]`)) {
    const t = document.createElement('script');
    t.src = widgetSource;
    document.head.appendChild(t);
  }
}
function translateInit() {
  const translateElement = new google.translate.TranslateElement(
    {
      pageLanguage: 'it',
    },
    'translateElement',
  );

  if (!document.getElementById('translateNotice')) {
    const mainNavElement = document.getElementsByClassName('nsw-masthead')[0];
    if (mainNavElement) {
      const alertElement = createTranslationAlert('translateNotice');
      mainNavElement.parentNode.insertBefore(
        alertElement,
        mainNavElement.nextSibling,
      );
    }
  }
}

export function GoogleTranslateWidget(props) {
  useEffect(() => {
    injectTranslateScript();
  }, []);
  return <Select {...props} />;
}
