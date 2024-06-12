const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const fileLoaderFinder = makeLoaderFinder('file-loader');

const plugins = (defaultPlugins) => {
  return [...defaultPlugins];
};

const svgoOptions = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertPathData: false,
          removeViewBox: false,
        },
      },
    },
    'removeTitle',
    'removeUselessStrokeAndFill',
  ],
};

function createSVGLoader(test) {
  return {
    test: test,
    use: [
      {
        loader: 'svg-loader',
      },
      {
        loader: 'svgo-loader',
        options: svgoOptions,
      },
    ],
  };
}

const modifyWebpackConfig = (config, { target, dev }, webpack) => {
  const fileLoader = config.module.rules.find(fileLoaderFinder);
  fileLoader.exclude = [/@mdi\/svg\/.*\.svg$/, /@material-design-icons\/svg\/filled\.svg$/, /nsw-design-system-plone6\/.*\.svg$/, ...fileLoader.exclude];

  const MDISVGLOADER = createSVGLoader(/@mdi\/svg\/.*\.svg$/);
  const MATERIALICONSSVGLOADER = createSVGLoader(/@material-design-icons\/svg\/filled\.svg$/);
  const NSWSVGLOEADER = createSVGLoader(/nsw-design-system-plone6\/.*\.svg$/);

  webpack.module.rules.push(MDISVGLOADER);
  webpack.module.rules.push(MATERIALICONSSVGLOADER);
  webpack.module.rules.push(NSWSVGLOEADER);

  return config;
};

module.exports = {
  modify: modifyWebpackConfig,
  plugins,
};
