import { CurrentSession } from '../classes/currentSession.js';
import { urlHandler } from './urlHandler.js';

/**
 * Check access for host and run handler for URL
 * @param req
 * @param res
 * @param globalVariables
 */
export const processRoute = (req, res, globalVariables) => {
  console.log(req.headers.host);
  // const host = globalVariables.hosts.getHostByName(req.headers.host);
  //
  // if (!host) {
  //   res.statusCode = 404;
  //   res.end("Can't find hostname");
  //   return;
  // }

  const currentSession = {};
  // const currentSession = new CurrentSession(globalVariables, host);

  const result = urlHandler(req.url, currentSession);

  if (!result) {
    res.statusCode = 404;
    res.end("Can't find page");
  }

  res.statusCode = 200;
  res.end(result);
};
