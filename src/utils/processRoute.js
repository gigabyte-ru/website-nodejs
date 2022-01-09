import { CurrentSession } from '../classes/currentSession.js';
import { runRouteHandlerFromUrl } from './runRouteHandlerFromUrl.js';

/**
 * Check access for host and run handler for URL
 * @param req
 * @param res
 * @param globalVariables
 */
export const processRoute = async (req, res, globalVariables) => {
  console.log(req.headers.host);
  const host = globalVariables.hosts.getHostByName(req.headers.host);

  if (!host) {
    res.statusCode = 404;
    res.end("Can't find hostname");
    return;
  }

  const currentSession = new CurrentSession(globalVariables, host);

  const result = await runRouteHandlerFromUrl(req.url, currentSession);

  if (!result) {
    res.statusCode = 404;
    res.end("Can't find page");
  }

  res.statusCode = 200;
  res.end(result);
};
