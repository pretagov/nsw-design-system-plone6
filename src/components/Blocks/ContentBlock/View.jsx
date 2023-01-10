import { ContentBlock } from 'nsw-design-system-plone6/components/Components/ContentBlock';
import { getLinks, getViewMore } from './helpers';

// TODO: Allow adding alt text to images
export function ContentBlockView({ data }) {
  return (
    <ContentBlock
      title={data.title}
      description={data.description}
      viewMoreUrl={getViewMore(data)}
      links={getLinks(data)}
      image={data.image}
      imageIsIcon={data.imageIsIcon}
    />
  );
}
