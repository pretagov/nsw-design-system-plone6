import { Edit } from '@plone/volto/components';
import View from '@plone/volto/components/theme/View/View';

// const contentRoutes = ['/search', '/sitemap'];
const contentRoutes = [];

// Backport https://github.com/plone/volto/pull/6173
const nonContentRoutesPublic = [
  '/login',
  '/logout',
  '/sitemap',
  '/register',
  '/search',
  '/change-password',
  '/contact-form',
  '/register',
  /\/passwordreset\/.*$/,
  '/passwordreset',
];

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

  // Backport https://github.com/plone/volto/pull/6173
  config.settings.nonContentRoutesPublic = nonContentRoutesPublic;

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
