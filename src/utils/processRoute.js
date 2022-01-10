import { currentSession } from '../classes/currentSession.js';
import { runRouteHandlerFromUrl } from './runRouteHandlerFromUrl.js';
import { globalVariables } from '../classes/globalVariables.js';
import { translateTemplate } from './translateTemplate.js';

/**
 * Check access for host and run handler for URL
 * @param req
 * @param res
 */
export const processRoute = async (req, res, type = 'http') => {
  const host = globalVariables?.hosts?.get(req.headers.host);

  if (!host) {
    res.statusCode = 404;
    res.end("Can't find hostname");
    return;
  }

  console.log(host.name);
  currentSession.init(host, type);

  const template = await runRouteHandlerFromUrl(req.url);

  if (!template) {
    res.statusCode = 404;
    res.end("Can't find page");
  }

  res.statusCode = 200;
  res.end(translateTemplate(template));
};
