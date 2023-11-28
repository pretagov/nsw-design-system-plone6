import { COLUMNSBLOCK } from '@eeacms/volto-columns-block/constants';
import { RenderBlocks } from '@plone/volto/components';
import config from '@plone/volto/registry';
import cx from 'classnames';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { getColumns } from '@eeacms/volto-columns-block/ColumnsBlock/utils';
import { getStyle } from '@eeacms/volto-columns-block/Styles';

const getSide = (side, v) => {
  // TODO: Add UI to actually set this
  if (typeof v?.[side] === 'string') {
    return `${v?.[side] ? `nsw-p-${side}-${v[side]}` : '0'}`;
  }
  return `${v?.[side] ? `${v[side]}${v.unit ? v.unit : 'px'}` : '0'}`;
};

const getSides = (v) => {
  return `${getSide('top', v)} ${getSide('right', v)} ${getSide(
    'bottom',
    v,
  )} ${getSide('left', v)}`;
};

const ColumnsBlockView = (props) => {
  const location = useLocation();
  const { gridSizes } = config.blocks.blocksConfig[COLUMNSBLOCK];
  const { data = {}, gridSize = 12, gridCols = [] } = props.data;
  const metadata = props.metadata || props.properties;
  const columnList = getColumns(data);
  const customId = props.data?.title
    ?.toLowerCase()
    ?.replace(/[^a-zA-Z-\s]/gi, '')
    ?.trim()
    ?.replace(/\s+/gi, '-');

  return (
    <div className="columns-view" id={customId}>
      <div
        className={cx(
          'nsw-grid',
          props.data.reverseWrap ? 'column-grid reverse-wrap' : 'column-grid',
        )}
      >
        {columnList.map(([id, column], index) => {
          return (
            <div
              key={id}
              className={cx(
                'nsw-col',
                gridSizes[gridCols[index]],
                column.settings?.column_class,
              )}
              {...getStyle(column.settings || {})}
            >
              <div className={getSides(column.settings?.padding)}>
                <RenderBlocks
                  {...props}
                  location={location}
                  metadata={metadata}
                  content={column}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColumnsBlockView;
