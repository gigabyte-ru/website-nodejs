import { HostsList } from '../classes/lists/HostsList.js';
import { CurrentSession } from '../classes/CurrentSession';
import { runRouteHandlerFromUrl } from './runRouteHandlerFromUrl.js';
import { translateTemplate } from './translateTemplate.js';

/**
 * Check access for host and run handler for URL
 * @param req
 * @param res
 */
export const processRoute = async (req, res) => {
  let requestHost = req.headers.host;
  console.log('Request host:', requestHost);

  if (requestHost.split(':')[0] === 'localhost') {
    requestHost = 'www.gigabyte.ru';
  }

  const host = await new HostsList().getByName(requestHost);

  if (!host) {
    res.statusCode = 404;
    res.end("Can't find hostname");
    return;
  }

  const currentSession = new CurrentSession(req, host);

  const template = await runRouteHandlerFromUrl(currentSession);

  if (!template) {
    res.statusCode = 404;
    res.end("Can't find page");
    return;
  }

  const result = await translateTemplate(template, currentSession);

  res.statusCode = 200;
  res.end(result);
};
