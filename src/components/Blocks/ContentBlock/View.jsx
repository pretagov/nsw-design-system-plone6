import { ContentBlock } from 'nsw-design-system-plone6/components/Components/ContentBlock';
import { getLinks, getViewMore } from './helpers';

// TODO: Allow adding alt text to images
export function ContentBlockView({ data, ...props }) {
  const description = ['<p></p>', '<p><br/></p>'].includes(
    data.description?.data,
  )
    ? null
    : data.description;
  return (
    <ContentBlock
      {...data}
      description={description}
      viewMoreUrl={getViewMore(data)}
      links={getLinks(data)}
      image={data.image ? `${data.image}/@@images/image` : null}
      columns={props.columns}
    />
  );
}
