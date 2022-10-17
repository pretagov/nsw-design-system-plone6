const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const fileLoaderFinder = makeLoaderFinder('file-loader');

const plugins = (defaultPlugins) => {
  return defaultPlugins;
};
const modifyWebpackConfig = (config, { target, dev }, webpack) => {
  const fileLoader = config.module.rules.find(fileLoaderFinder);
  fileLoader.exclude = [/@mdi\/svg\/.*\.svg$/, ...fileLoader.exclude];

  const MDISVGLOADER = {
    test: /@mdi\/svg\/.*\.svg$/,
    use: [
      {
        loader: 'svg-loader',
      },
      {
        loader: 'svgo-loader',
        options: {
          plugins: [
            { removeTitle: true },
            { convertPathData: false },
            { removeUselessStrokeAndFill: true },
            { removeViewBox: false },
          ],
        },
      },
    ],
  };

  webpack.module.rules.push(MDISVGLOADER);

  return config;
};

module.exports = {
  modify: modifyWebpackConfig,
  plugins,
};
