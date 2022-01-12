import { CurrentSession } from '../classes/CurrentSession.js';
import { runRouteHandlerFromUrl } from './runRouteHandlerFromUrl.js';
import { globalVariables } from '../classes/GlobalVariables.js';
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
  const currentSession = new CurrentSession(req, host, type);

  const template = await runRouteHandlerFromUrl(currentSession);

  if (!template) {
    res.statusCode = 404;
    res.end("Can't find page");
  }

  res.statusCode = 200;
  res.end(translateTemplate(template, currentSession));
};

// const receiveArgs = async (req) =>
//   new Promise((resolve) => {
//     const body = [];
//     req
//       .on('data', (chunk) => {
//         body.push(chunk);
//       })
//       .on('end', async () => {
//         const data = body.join('');
//         resolve(data);
//       });
//   });
