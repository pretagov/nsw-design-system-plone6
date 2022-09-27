import { Edit } from '@plone/volto/components';
import View from '@plone/volto/components/theme/View/View';

const contentRoutes = ['/search'];

const removeFromArray = (item, array) => {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
};

export const updateRoutesConfig = (config) => {
  // Some routes are used in non-cms pages. Remove those from the list
  contentRoutes.forEach((route) => {
    removeFromArray(route, config.settings.nonContentRoutes);
  });

  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/search',
      component: View,
      exact: true,
    },
    {
      path: '/search/edit',
      component: Edit,
    },
  ];
};

export default updateRoutesConfig;
