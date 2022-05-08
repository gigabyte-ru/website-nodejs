import http from 'http';
import https from 'https';
import events from 'events';
import { processRoute } from './utils';
import dotenv from 'dotenv';

dotenv.config();

bootstrapServer(http.createServer(), process.env.SERVER_HTTP_PORT).then();

// bootstrapServer(https.createServer(), process.env.SERVER_HTTPS_PORT).then();

/**
 * @param server
 * @param { number } PORT
 * @return { Promise<void> }
 */
async function bootstrapServer(server, PORT) {
  // events.once(server, 'listening').then(async () => {
  //   console.log(`Server running at http://localhost:${PORT}/`);

  //   for await (const [err] of events.on(server, 'error')) {
  //     console.error(err);
  //   }

  //   for await (const [req, res] of events.on(server, 'request')) {
  //     console.log(req)
  //     res.write('hello\n');
  //     res.end();
  //     //processRoute(req, res).then();
  //   }
  // });
  
  server.on('listening', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  })

  server.on('request', async (req, res) => {
    await processRoute(req, res);
  })

  server.listen(PORT);
}