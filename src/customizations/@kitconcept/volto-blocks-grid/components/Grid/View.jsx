import { BlockRenderer } from '@kitconcept/volto-blocks-grid/components';
import { withBlockExtensions } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';

function DefaultLayout({ data, path }) {
  const maxNumberOfColumns =
    config.blocks.blocksConfig[data?.['@type']]?.maxNumberOfColumns ||
    config.blocks.blocksConfig.__grid.maxNumberOfColumns ||
    4;
  const displayableColumns = (data.columns || []).slice(0, maxNumberOfColumns);

  return (
    <>
      {data.headline && <h2 className="headline">{data.headline}</h2>}
      <div className="nsw-grid">
        {displayableColumns.map((column) => (
          <div
            key={column.id}
            className={cx('nsw-col', {
              'nsw-col-sm-6': data?.columns?.length === 2,
              'nsw-col-sm-4': data?.columns?.length === 3,
              'nsw-col-sm-3': data?.columns?.length >= 4,
            })}
          >
            <BlockRenderer
              block={column.id}
              type={column['@type']}
              data={column}
              path={path}
              columns={data?.columns.length}
            />
          </div>
        ))}
      </div>
    </>
  );
}

const ViewGrid = ({ data, path }) => {
  const blockConfig = config.blocks.blocksConfig[data['@type']];
  const Layout = blockConfig?.layoutComponent || DefaultLayout;

  return (
    <div className="block __grid">
      <Layout data={data} path={path} />
    </div>
  );
};

export default withBlockExtensions(ViewGrid);
