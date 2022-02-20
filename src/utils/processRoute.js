import { CurrentSession, GlobalVariables, HostsList } from '../classes';
import { runRouteHandlerFromUrl } from './runRouteHandlerFromUrl.js';
import { translateTemplate } from './translateTemplate.js';

/**
 * Check access for host and run handler for URL
 * @param req
 * @param res
 */
export const processRoute = async (req, res) => {
  const requestHost = req.headers.host;
  console.log('Request host:', requestHost);

  const host = await new HostsList().getByName(requestHost);

  console.log('Host name:', host.data.name);

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
  }

  res.statusCode = 200;
  res.end(translateTemplate(template, currentSession));
};
