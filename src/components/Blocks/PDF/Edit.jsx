import BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';

import config from '@plone/volto/registry';
import { useIntl } from 'react-intl';

function PDFBlockDisplay({ data, id, onChangeBlock, selected, ...props }) {
  return <p>PDF Edit</p>;
}

function PDFBlockSidebar({ data, block, onChangeBlock, selected }) {
  const intl = useIntl();
  const schema = config.blocks.blocksConfig[data['@type']].blockSchema({
    data,
    intl,
  });

  return (
    <SidebarPortal selected={selected}>
      <BlockDataForm
        schema={schema}
        title={schema.title}
        onChangeBlock={onChangeBlock}
        onChangeField={(id, value) => {
          onChangeBlock(block, {
            ...data,
            [id]: value,
          });
        }}
        formData={data}
        block={block}
      />
    </SidebarPortal>
  );
}

export function PDFBlockEdit(props) {
  return (
    <>
      <PDFBlockDisplay {...props} id={props.block} />
      <PDFBlockSidebar
        data={props.data}
        block={props.block}
        onChangeBlock={props.onChangeBlock}
        selected={props.selected}
      />
    </>
  );
}
