import { router } from '../router/router.js';

/**
 * Find handler for URL and run it
 * @param url
 * @returns {null|string}
 */
export const runRouteHandlerFromUrl = async (currentSession) => {
  const routerWithRegexp = router.map((r) => ({
    ...r,
    regexp: routerPathToRegexp(r.path),
  }));

  const findRoute = routerWithRegexp
    .map((r) => {
      const result = currentSession.url.path.match(r.regexp);
      if (result) {
        return {
          ...r,
          params: getParamsFromMatchResult(r.path, result),
        };
      }

      return null;
    })
    .filter((r) => r);

  if (findRoute.length) {
    const route = findRoute[0];
    currentSession.addRoute(route);

    return await route.handler(currentSession);
  }

  return null;
};

/**
 * Generate RegExp for router URL string
 * @param path
 * @returns {RegExp}
 */
const routerPathToRegexp = (path) => {
  const pathSplit = path?.split('/');

  const prepareString = pathSplit
    .map((p) => {
      if (p[0] === ':') {
        return '([a-zA-Z_0-9-]+)?';
      }
      return p;
    })
    .join('/');

  return new RegExp(`^${prepareString}/?$`);
};

/**
 * Map params from router path on matches
 * @param routerPath
 * @param matches
 * @returns {{}}
 */
const getParamsFromMatchResult = (routerPath, matches) => {
  const params = {};

  const pathSplit = routerPath?.split('/');
  const paramMatches = [...matches];
  paramMatches.shift();

  for (const pathFragment of pathSplit) {
    if (pathFragment[0] === ':') {
      params[pathFragment.slice(1)] = paramMatches.shift();
    }
  }

  return params;
};
