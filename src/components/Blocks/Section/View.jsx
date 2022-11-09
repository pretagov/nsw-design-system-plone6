import { RenderBlocks } from '@plone/volto/components';
import React from 'react';
import { Section } from '../../Components/Section';

// TODO: Support adding alt text to images
const SectionView = ({ data, isEditMode, ...props }) => {
  const metadata = props.metadata || props.properties;
  const imageSrc = data.sectionimage
    ? `data:${data.image['content-type']};base64,${data.sectionimage.data}`
    : null;

  return (
    <Section
      title={data.title}
      description={data.description}
      padding={data.sectionspacing}
      isBox={data.sectionbox}
      colour={data.sectioncolour}
      shouldInvert={data.sectioninvert}
      imageSrc={imageSrc}
      showSeparator={data.sectionshowSeparator}
    >
      <RenderBlocks {...props} metadata={metadata} content={data.block} />
    </Section>
  );
};

export default SectionView;
