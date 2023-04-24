/**
 * Api helper.
 * @module helpers/Api
 */

import { stripQuerystring } from '@plone/volto/helpers';
import { addHeadersFactory } from '@plone/volto/helpers/Proxy/Proxy';
import config from '@plone/volto/registry';
import superagent from 'superagent';
import Cookies from 'universal-cookie';

const methods = ['get', 'post', 'put', 'patch', 'del'];

/**
 * Format the url.
 * @function formatUrl
 * @param {string} path Path (or URL) to be formatted.
 * @returns {string} Formatted path.
 */
function formatUrl(path) {
  const { settings } = config;
  const APISUFIX = settings.legacyTraverse ? '' : '/++api++';

  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  let apiPath = '';
  if (settings.internalApiPath && __SERVER__) {
    apiPath = settings.internalApiPath;
  } else if (settings.apiPath) {
    apiPath = settings.apiPath;
  }

  return `${apiPath}${APISUFIX}${adjustedPath}`;
}

/**
 * Api class.
 * @class Api
 */
class Api {
  /**
   * Constructor
   * @method constructor
   * @constructs Api
   */
  constructor(req) {
    const cookies = new Cookies();

    const {
      responseStartTimeout = 30000,
      responseEndTimeout = 60000,
      logRequestedPaths = false,
    } =
      typeof window !== 'undefined'
        ? {
            responseStartTimeout: window.env?.RAZZLE_RESPONSE_START_TIMEOUT,
            responseEndTimeout: window.env?.RAZZLE_RESPONSE_END_TIMEOUT,
            logRequestedPaths: window.env?.RAZZLE_LOG_REQUESTED_PATHS,
          }
        : {
            responseStartTimeout: process.env?.RAZZLE_RESPONSE_START_TIMEOUT,
            responseEndTimeout: process.env?.RAZZLE_RESPONSE_END_TIMEOUT,
            logRequestedPaths: process.env?.RAZZLE_LOG_REQUESTED_PATHS,
          };

    methods.forEach((method) => {
      this[method] = (
        path,
        { params, data, type, headers = {}, checkUrl = false } = {},
      ) => {
        let request;
        let promise = new Promise((resolve, reject) => {
          const url = formatUrl(path);

          if (logRequestedPaths) {
            console.log(`Starting '${method}' request for path '${url}'`);
          }

          request = superagent[method](url);

          if (responseStartTimeout || responseEndTimeout) {
            request.timeout({
              response: responseStartTimeout, // Wait for the server to start sending. Defaults to 30s
              deadline: responseEndTimeout, // Wait for the server to finish response. Defaults to 60s
            });
          }

          if (params) {
            request.query(params);
          }

          let authToken;
          if (req) {
            // We are in SSR
            authToken = req.universalCookies.get('auth_token');
            request.use(addHeadersFactory(req));
          } else {
            authToken = cookies.get('auth_token');
          }
          if (authToken) {
            request.set('Authorization', `Bearer ${authToken}`);
          }

          request.set('Accept', 'application/json');

          if (type) {
            request.type(type);
          }

          Object.keys(headers).forEach((key) => request.set(key, headers[key]));

          if (data) {
            request.send(data);
          }

          request.end((err, response) => {
            if (err && err.timeout) {
              if (__SERVER__) {
                console.log(`timeout on request for path: ${req.path}`);
              }
              return reject(err);
            }
            if (
              checkUrl &&
              request.url &&
              request.xhr &&
              stripQuerystring(request.url) !==
                stripQuerystring(request.xhr.responseURL)
            ) {
              if (request.xhr.responseURL?.length === 0) {
                return reject({
                  code: 408,
                  status: 408,
                  url: request.xhr.responseURL,
                });
              }
              return reject({
                code: 301,
                url: request.xhr.responseURL,
              });
            }
            return err ? reject(err) : resolve(response.body || response.text);
          });
        });
        promise.request = request;
        return promise;
      };
    });
  }
}

export default Api;
