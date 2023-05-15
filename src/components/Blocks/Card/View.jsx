import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import { getHref } from 'nsw-design-system-plone6/components/Blocks/Card/helpers';
import { Card } from 'nsw-design-system-plone6/components/Components/Card';

// TODO: Support adding alt text to images
export function CardView({ data, isEditMode, ...props }) {
  let href = getHref(data);
  if (isInternalURL(href)) {
    href = flattenToAppURL(href);
  }

  const description = ['<p></p>', '<p><br/></p>'].includes(
    data.description?.data,
  )
    ? null
    : data.description;

  return (
    <Card
      {...props}
      {...data}
      description={description}
      href={href}
      image={data.image ? `${data.image}/@@images/image` : null}
      isEditMode={isEditMode}
    />
  );
}
