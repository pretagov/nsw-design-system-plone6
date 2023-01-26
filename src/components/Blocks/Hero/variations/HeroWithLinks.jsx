import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import { Hero } from 'nsw-design-system-plone6/components/Components/Hero';

export const HeroWithLinks = ({ data, ...props }) => {
  const imageUrl = data.url
    ? `${flattenToAppURL(data?.url)}/@@images/image`
    : null;
  const linkUrl = data.linkHref
    ? `${flattenToAppURL(data.linkHref[0]?.['@id'])}`
    : null;

  const linksList = data.links.map((linkItem) => {
    let href = linkItem.link && linkItem.link[0] && linkItem.link[0]['@id'];
    if (isInternalURL(href)) {
      href = flattenToAppURL(href);
    }
    return { title: linkItem.title, link: href };
  });

  return (
    <>
      <Hero
        title={data.title}
        description={data.description}
        imageUrl={imageUrl}
        linkTitle={data.linkTitle}
        linkUrl={linkUrl}
        linksTitle={data.linksTitle || ''}
        linksList={linksList}
        width={data.heroWidth}
      />
    </>
  );
};
