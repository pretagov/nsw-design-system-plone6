import { GlobalAlert } from 'nsw-design-system-plone6/components/Components/GlobalAlert';

export function GlobalAlertView({ title, description, buttonText, url }) {
  return <GlobalAlert title={title} description={description} buttonText={buttonText} url={url} />;
}
