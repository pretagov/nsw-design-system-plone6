import { Edit } from '@plone/volto/components';
import View from '@plone/volto/components/theme/View/View';

// Used to remove all the public-facing CMS-UI pages from the below nonContentRoutesPublic list
const contentRoutes = ['/search', '/sitemap'];

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
  nonContentRoutesPublic.forEach((route) => {
    if (!contentRoutes.includes(route)) {
      removeFromArray(route, nonContentRoutesPublic);
    }
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
