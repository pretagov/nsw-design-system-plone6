const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const fileLoaderFinder = makeLoaderFinder('file-loader');

function updateSASSPlugin(plugins) {
  const newPlugins = plugins.filter((plugin) => plugin !== 'scss');
  newPlugins.push({
    name: 'scss',
    options: {
      sass: {
        dev: {
          sassOptions: {
            outputStyle: 'expanded',
            quietDeps: true,
          },
        },
        prod: {
          sassOptions: {
            outputStyle: 'expanded',
            quietDeps: true,
          },
        },
      },
    },
  });
  return newPlugins;
}

const plugins = (defaultPlugins) => {
  let plugins = defaultPlugins;
  plugins = updateSASSPlugin(plugins);
  return [...plugins];
};
const modifyWebpackConfig = (config, { target, dev }, webpack) => {
  const fileLoader = config.module.rules.find(fileLoaderFinder);
  fileLoader.exclude = [
    /@mdi\/svg\/.*\.svg$/,
    /@material-design-icons\/svg\/filled\.svg$/,
    /nsw-design-system-plone6\/.*\.svg$/,
    ...fileLoader.exclude,
  ];

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
  const MATERIALICONSSVGLOADER = {
    test: /@material-design-icons\/svg\/filled\.svg$/,
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
  const NSWSVGLOEADER = {
    test: /nsw-design-system-plone6\/.*\.svg$/,
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
            { removeUselessStrokeAndFill: false },
            { removeViewBox: false },
          ],
        },
      },
    ],
  };

  webpack.module.rules.push(MDISVGLOADER);
  webpack.module.rules.push(MATERIALICONSSVGLOADER);
  webpack.module.rules.push(NSWSVGLOEADER);

  return config;
};

module.exports = {
  modify: modifyWebpackConfig,
  plugins,
};
