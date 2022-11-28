import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import { Card } from 'nsw-design-system-plone6/components/Components/Card';

// TODO: Support adding alt text to images
const CardView = ({ data, isEditMode }) => {
  let href = data.link?.[0]?.['@id'] || data['@id'] || '';
  if (isInternalURL(href)) {
    href = flattenToAppURL(href);
  }

  return <Card {...data} href={href} />;
};

export default CardView;
