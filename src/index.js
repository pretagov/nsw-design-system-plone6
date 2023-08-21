import iconA from '@eeacms/volto-columns-block/ColumnsBlock/icons/two-half-columns.svg';
import iconB from '@eeacms/volto-columns-block/ColumnsBlock/icons/one-third-left.svg';
import iconC from '@eeacms/volto-columns-block/ColumnsBlock/icons/one-third-right.svg';
import iconD from '@eeacms/volto-columns-block/ColumnsBlock/icons/three-third-columns.svg';
import iconE from '@eeacms/volto-columns-block/ColumnsBlock/icons/three-columns.svg';
import iconF from '@eeacms/volto-columns-block/ColumnsBlock/icons/four-quarter-columns.svg';
import iconG from '@eeacms/volto-columns-block/ColumnsBlock/icons/full-column.svg';
import applyAddonConfig from './config';

const applyConfig = (config) => {
  

  config.blocks.blocksConfig.columnsBlock.gridSizes = {
    full: '',
    halfWidth: 'nsw-col-sm-6',
    twoThirds: 'nsw-col-sm-8',
    oneThird: 'nsw-col-sm-4',
    halfWidthBig: 'nsw-col-sm-6',
    oneThirdSmall: 'nsw-col-sm-4',
    oneQuarter: 'nsw-col-sm-3',
    threeQuarters: 'nsw-col-sm-9',
  };
  config.blocks.blocksConfig.columnsBlock.available_colors = [
    '0a2f3c'
  ]
  config.blocks.blocksConfig.columnsBlock.variants = [
    {
      icon: iconA,
      defaultData: {
        gridSize: 12,
        gridCols: ['halfWidth', 'halfWidth'],
      },
      common: true,
      title: '50 / 50',
    },
    {
      icon: iconB,
      defaultData: {
        gridSize: 12,
        gridCols: ['oneThird', 'twoThirds'],
      },
      common: true,
      title: '30 / 70',
    },
    {
      icon: iconC,
      defaultData: {
        gridSize: 12,
        gridCols: ['twoThirds', 'oneThird'],
      },
      common: true,
      title: '70 / 30',
    },
    {
      icon: iconD,
      defaultData: {
        gridSize: 12,
        gridCols: ['oneThird', 'oneThird', 'oneThird'],
      },
      common: true,
      title: '33 / 33 / 33',
    },
    {
      icon: iconE,
      defaultData: {
        gridSize: 12,
        gridCols: ['oneThirdSmall', 'halfWidthBig', 'oneThirdSmall'],
      },
      common: true,
      title: '25 / 50 / 25',
    },
    {
      icon: iconF,
      defaultData: {
        gridSize: 12,
        gridCols: ['oneQuarter', 'oneQuarter', 'oneQuarter', 'oneQuarter'],
      },
      common: true,
      title: '25 / 25 / 25 / 25',
    },
    {
      icon: iconG,
      defaultData: {
        gridSize: 12,
        gridCols: ['full'],
      },
      common: true,
      title: '100',
    },
  ];

  applyAddonConfig(config);

  return config;
};

export default applyConfig;
