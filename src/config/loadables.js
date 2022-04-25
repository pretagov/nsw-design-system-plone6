import loadable from '@loadable/component';

export const updateLoadablesConfig = (config) => {
  // config.settings.loadables['nswDesignSystem'] = loadable(
  //   () => import('nsw-design-system/src/main'),
  //   {
  //     ssr: false,
  //   },
  // );
  // config.settings.loadables = {
  //   ...config.settings.loadables,
  //   nswDesignSystem: loadable.lib(() => import('nsw-design-system/src/main'), {
  //     ssr: false,
  //   }),
  // };
};

export default updateLoadablesConfig;
