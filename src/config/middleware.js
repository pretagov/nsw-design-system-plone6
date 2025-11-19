import { getAPIResourceWithAuth } from '@plone/volto/helpers';
import superagent from 'superagent';

// Static resources
import android192 from '../public/android-chrome-192x192.png';
import android512 from '../public/android-chrome-512x512.png';
import appleTouchIcon from '../public/apple-touch-icon.png';
import faviconIco from '../public/favicon.ico';
import iconSvg from '../public/icon.svg';

const staticResourceMapping = {
  '/android-chrome-192x192.png': { url: android192, contentType: 'image/png' },
  '/android-chrome-512x512.png': { url: android512, contentType: 'image/png' },
  '/apple-touch-icon.png': { url: appleTouchIcon, contentType: 'image/png' },
  '/favicon.ico': { url: faviconIco, contentType: 'image/ico' },
  '/icon.svg': { url: iconSvg, contentType: 'image/svg+xml' },
};

// Taken from @plone/volto/src/express-middleware/images.js
const HEADERS = ['content-type', 'content-disposition', 'cache-control'];
function siteLogoMiddlewareFunction(req, res, next) {
  getAPIResourceWithAuth(req)
    .then((resource) => {
      // Just forward the headers that we need
      HEADERS.forEach((header) => {
        if (resource.headers[header]) {
          res.set(header, resource.headers[header]);
        }
      });
      res.send(resource.body);
    })
    .catch(next);
}

function getResource(url) {
  return new Promise((resolve, reject) => {
    try {
      superagent.get(url).end((err, result) => {
        if (err) resolve(result || err.message);
        else resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export function customMiddleware() {
  if (__SERVER__) {
    const express = require('express');

    const nswMiddleware = express.Router();
    nswMiddleware.id = 'nsw-middleware';
    nswMiddleware.all('**/@@site-logo/*', siteLogoMiddlewareFunction);

    // Simple healthcheck middleware
    nswMiddleware.all('/ok', (req, res, next) => {
      res.send('ok');
    });
    
    // Object.entries(staticResourceMapping).forEach(([path, data]) => {
    //   nswMiddleware.get(path, (req, res) => {
    //     return getResource(data.url)
    //       .then((resource) => {
    //         res.set('Content-Type', data.contentType);
    //         res.set('Content-Disposition', `inline`);
    //         res.send(resource.body);
    //       })
    //       .catch((err) => {
    //         return res.status(400).send(err);
    //       });
    //   });
    // });

    return nswMiddleware;
  }

  return {};
}

export const updateMiddlewareConfig = (config) => {
  if (__SERVER__) {
    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      customMiddleware(),
    ];
  }
};

export default updateMiddlewareConfig;
