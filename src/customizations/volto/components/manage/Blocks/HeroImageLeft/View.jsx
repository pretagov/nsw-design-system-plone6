import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import Hero from 'nsw-design-system-plone6/components/Components/Hero';

const View = ({ data, ...props }) => {
  const imageUrl =
    props.imageUrl ??
    (data.url ? `${flattenToAppURL(data?.url)}/@@images/image/great` : null);
  const linkUrl = data.linkHref
    ? `${flattenToAppURL(data.linkHref[0]?.['@id'])}`
    : null;

  const variations = config.blocks.blocksConfig[data['@type']].variations;
  const variation = variations.find((item) => {
    return item.id === data.variation;
  });

  if (variation.id === 'default') {
    return (
      <Hero
        title={data.title}
        description={data.description}
        imageUrl={imageUrl}
        linkTitle={data.linkTitle}
        linkUrl={linkUrl}
        width={data.heroWidth}
      />
    );
  }

  const VariationTemplate = variation.template || null;

  return <VariationTemplate {...props} data={data} />;
};

export default View;
