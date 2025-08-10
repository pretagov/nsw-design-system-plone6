import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import config from '@plone/volto/registry';
import { GlobalAlertView } from './View';
import { globalAlertSchema } from './schema';

function SidebarContents(props) {
  const { data, block, onChangeBlock } = props;
  const schema = globalAlertSchema({ ...props });

  return (
    <BlockDataForm
      schema={schema}
      title={`${config.blocks.blocksConfig[data['@type']].title}`}
      onChangeField={(id, value) => {
        onChangeBlock(block, {
          ...data,
          [id]: value,
        });
      }}
      formData={data}
      block={block}
    />
  );
}

export function GlobalAlertEdit(props) {
  const { data, selected } = props;

  return (
    <>
      <GlobalAlertView data={data} />
      <SidebarPortal selected={selected}>
        <SidebarContents {...props} />
      </SidebarPortal>
    </>
  );
}
