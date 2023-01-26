import { BlockRenderer } from '@kitconcept/volto-blocks-grid/components';
import { withBlockExtensions } from '@plone/volto/helpers';
import cx from 'classnames';

const ViewGrid = ({ data, path }) => {
  return (
    <div className="block __grid">
      {data.headline && <h2 className="headline">{data.headline}</h2>}
      <div className="nsw-grid">
        {data.columns.map((column) => (
          <div
            key={column.id}
            className={cx('nsw-col', {
              'nsw-col-sm-6': data?.columns?.length === 2,
              'nsw-col-sm-4': data?.columns?.length === 3,
              'nsw-col-sm-3': data?.columns?.length === 4,
            })}
          >
            <BlockRenderer
              block={column.id}
              type={column['@type']}
              data={column}
              path={path}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default withBlockExtensions(ViewGrid);
