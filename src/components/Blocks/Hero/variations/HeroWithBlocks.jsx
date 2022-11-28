import { RenderBlocks } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Hero } from 'nsw-design-system-plone6/components/Components/Hero';
import React from 'react';

export const HeroWithBlocks = ({ data, ...props }) => {
  const metadata = props.metadata || props.properties;
  const imageUrl = data.url
    ? `${flattenToAppURL(data?.url)}/@@images/image`
    : null;
  const linkUrl = data.linkHref
    ? `${flattenToAppURL(data.linkHref[0]?.['@id'])}`
    : null;

  return (
    <>
      <Hero
        title={data.title}
        description={data.description}
        imageUrl={imageUrl}
        linkTitle={data.linkTitle}
        linkUrl={linkUrl}
        width={data.heroWidth}
        contentChildren={
          <RenderBlocks {...props} metadata={metadata} content={data.block} />
        }
      />
    </>
  );
};
