import http from 'http';
import https from 'https';
import events from 'events';
import { processRoute } from './utils';
import dotenv from 'dotenv';

dotenv.config();

bootstrapServer(http.createServer(), process.env.SERVER_HTTP_PORT).then();

bootstrapServer(https.createServer(), process.env.SERVER_HTTPS_PORT).then();

/**
 * @param server
 * @param { number } PORT
 * @return { Promise<void> }
 */
async function bootstrapServer(server, PORT) {
  server.listen(PORT);
  events.once(server, 'listening').then(async () => {
    console.log(`Server running at http://localhost:${PORT}/`);

    for await (const [err] of events.on(server, 'error')) {
      console.error(err);
    }

    for await (const [req, res] of events.on(server, 'request')) {
      processRoute(req, res).then();
    }
  });
}
