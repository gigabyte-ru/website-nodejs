import { router } from '../router/router.js';

/**
 * Find handler for URL and run it
 * @param url
 * @param currentSession
 * @returns {null|string}
 */
export const runRouteHandlerFromUrl = async (url, currentSession) => {
  const [path, query] = url.split('?');
  console.log(path);

  const routerWithRegexp = router.map((r) => ({
    ...r,
    regexp: routerPathToRegexp(r.path),
  }));

  const findRoute = routerWithRegexp
    .map((r) => {
      const result = path.match(r.regexp);
      if (result) {
        return {
          ...r,
          params: getParamsFromMatchResult(r.path, result),
        };
      }

      return null;
    })
    .filter((r) => r);

  console.log({ findRoute });

  if (findRoute.length) {
    return await findRoute[0].handler({
      currentSession,
      params: findRoute[0].params,
      searchParams: new URLSearchParams(query),
    });
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
