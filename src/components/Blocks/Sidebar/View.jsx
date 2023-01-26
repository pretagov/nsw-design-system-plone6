import config from '@plone/volto/registry';
import Sidebar from './Sidebar';

const SidebarView = ({ data }) => {
  const { sidebar, main } = data;
  const SidebarView =
    config.blocks.blocksConfig[sidebar?.['@type']]?.view ?? null;
  const MainView = config.blocks.blocksConfig[main?.['@type']]?.view ?? null;

  if (!SidebarView) {
    return null;
  }
  if (!MainView) {
    return null;
  }

  return (
    <Sidebar
      sidebarPosition={data.sidebarPosition}
      MainComponent={<MainView data={main} />}
      SidebarComponent={<SidebarView data={sidebar} />}
    />
  );
};

export default SidebarView;
