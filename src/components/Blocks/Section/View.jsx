import { RenderBlocks } from '@plone/volto/components';
import React from 'react';
import { Section } from '../../Components/Section';

// TODO: Support adding alt text to images
const SectionView = ({ data, isEditMode, ...props }) => {
  const metadata = props.metadata || props.properties;
  const imageSrc = data.image
    ? `data:${data.image['content-type']};base64,${data.image.data}`
    : null;

  return (
    <Section
      title={data.title}
      description={data.description}
      padding={data.spacing}
      isBox={data.box}
      colour={data.colour}
      shouldInvert={data.invert}
      imageSrc={imageSrc}
      showSeparator={data.showSeparator}
    >
      <RenderBlocks {...props} metadata={metadata} content={data.block} />
    </Section>
  );
};

export default SectionView;
