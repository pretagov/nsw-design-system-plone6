import { RenderBlocks } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import React from 'react';
import Hero from '../../../../../../components/Components/Hero';

const View = ({ data, ...props }) => {
  const metadata = props.metadata || props.properties;
  const imageUrl = data.url
    ? `${flattenToAppURL(data?.url)}/@@images/image`
    : null;
  const linkUrl = data.linkHref
    ? `${flattenToAppURL(data.linkHref[0]?.['@id'])}`
    : null;

  const variations = config.blocks.blocksConfig[data['@type']].variations;
  // TODO: Variation is just used to adjust the child here. It should be able to change the entire hero
  const variation = variations.find((item) => {
    return item.id === data.variation;
  });
  const VariationTemplate = variation.template || null;

  return (
    <>
      <Hero
        title={data.title}
        description={data.description}
        imageUrl={imageUrl}
        linkTitle={data.linkTitle}
        linkUrl={linkUrl}
        contentChildren={
          data.variation === 'default' ? (
            <RenderBlocks {...props} metadata={metadata} content={data.block} />
          ) : (
            <VariationTemplate {...props} data={data} />
          )
        }
      />
    </>
  );
};

export default View;
