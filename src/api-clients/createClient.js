const { flow, keys, each, map } = require('lodash/fp');

/**
 * @param {{ baseURL: string, auth?: Object }} config
 * @param {Object} routes
 * @param {Object} httpClient
 */
const createClient = (config, routes, httpClient) => {
  const instance = httpClient.create(config);

  const client = {};

  flow(
    keys,
    map(key => ({ key, getOptions: routes[key] })),
    each(({ key, getOptions }) => {
      client[key] = (...args) => {
        const options = getOptions(...args);

        console.log('debug', options.method, options.url);

        return instance(options);
      };
    }),
  )(routes);

  return client;
};

module.exports = {
  createClient,
};
