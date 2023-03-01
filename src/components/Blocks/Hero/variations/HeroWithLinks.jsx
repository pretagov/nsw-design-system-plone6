import { flattenToAppURL } from '@plone/volto/helpers';
import { Hero } from 'nsw-design-system-plone6/components/Components/Hero';

export const HeroWithLinks = ({ data }) => {
  const imageUrl = data.url
    ? `${flattenToAppURL(data?.url)}/@@images/image`
    : null;
  const linkUrl = data.linkHref
    ? `${flattenToAppURL(data.linkHref[0]?.['@id'])}`
    : null;

  const linksList = data.links?.reduce((list, item) => {
    if (item.link && item.link[0] && item.link[0]) {
      list.push({ title: item.title, link: item.link[0] });
    }
    return list;
  }, []);

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
