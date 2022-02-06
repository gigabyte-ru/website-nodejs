import http from 'http';
import { processRoute } from './utils';
import dotenv from 'dotenv';

dotenv.config();
const HTTP_PORT = process.env.SERVER_HTTP_PORT;

http
  .createServer(async (req, res) => {
    await processRoute(req, res);
  })
  .listen(HTTP_PORT, () => {
    console.log(`HTTP-server running at http://localhost:${HTTP_PORT}/`);
  })
  .on('error', (err) => {
    if (err.code === 'EACCES') {
      console.log(`No access to port: ${HTTP_PORT}`);
    }
  });
