import { flattenToAppURL } from '@plone/volto/helpers';
import { DropdownQuickNavigationView } from 'nsw-design-system-plone6/components/Blocks/DropdownQuickNavigation/View';
import Hero from 'nsw-design-system-plone6/components/Components/Hero';
import React from 'react';

export const HeroWithDropdownQuickNavigation = ({ data, ...props }) => {
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
        contentChildren={<DropdownQuickNavigationView {...props} data={data} />}
      />
    </>
  );
};
