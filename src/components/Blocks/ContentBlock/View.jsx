import { ContentBlock } from 'nsw-design-system-plone6/components/Components/ContentBlock';
import { getLinks, getViewMore } from './helpers';

// TODO: Allow adding alt text to images
export function ContentBlockView({ data }) {
  return (
    <ContentBlock
      {...data}
      viewMoreUrl={getViewMore(data)}
      links={getLinks(data)}
      image={data.image ? `${data.image}/@@images/image` : null}
    />
  );
}
