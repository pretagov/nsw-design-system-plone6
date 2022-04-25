import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import React from 'react';
import { useIntl } from 'react-intl';
import withSubBlock from '../../../hocs/withSubBlock';
import { Section } from '../../Components/Section';
import schema from './schema';

const SubblockEdit = ({
  block: sectionBlockId,
  data,
  onChangeBlock,
  selected,
  selectedBlock,
  BlockEditor, // Comes from 'withSubBlock
  ToolbarButtons, // Comes from 'withSubBlock
}) => {
  const intl = useIntl();

  return (
    <>
      {selected ? <div className="toolbar">{ToolbarButtons}</div> : null}
      <Section
        title={data.title}
        description={data.description}
        padding={data.spacing}
        isBox={data.box}
        colour={data.colour}
        shouldInvert={data.invert}
        imageSrc={
          data.image
            ? `data:${data.image['content-type']};base64,${data.image.data}`
            : null
        }
        showSeparator={data.showSeparator}
      >
        {BlockEditor}
      </Section>

      <SidebarPortal selected={selected && selectedBlock === sectionBlockId}>
        <BlockDataForm
          schema={schema({ intl })}
          title="Section block"
          onChangeField={(id, value) => {
            onChangeBlock(sectionBlockId, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
          block={sectionBlockId}
        />
      </SidebarPortal>
    </>
  );
};

export default withSubBlock(schema)(SubblockEdit);
