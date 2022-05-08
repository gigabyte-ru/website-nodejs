import { CurrentSession, GlobalVariables, HostsList } from '../classes';
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
    console.log('Recreate on host:', requestHost);
  }

  const host = await new HostsList().getByName(requestHost);

  if (!host) {
    res.statusCode = 404;
    res.end("Can't find hostname");
    return;
  }

  console.log('Host name:', host.data.name);

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
