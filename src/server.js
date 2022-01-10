'use strict';

import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import { globalVariables } from './classes/globalVariables.js';
import { processRoute } from './utils/index.js';

const HTTP_PORT = process.env.SERVER_HTTP_PORT;

await globalVariables.init();

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
