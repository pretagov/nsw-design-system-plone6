import { GlobalAlert } from 'nsw-design-system-plone6/components/Components/GlobalAlert';

export function GlobalAlertView({ data }) {
  const { title, description, buttonText, url } = data;
  return (
    <GlobalAlert
      title={title}
      description={description}
      buttonText={buttonText}
      url={url}
    />
  );
}
