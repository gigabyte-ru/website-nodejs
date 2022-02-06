import http from 'http';
import { processRoute } from './utils';
import { Articles, Categories, Countries, Langs } from './classes';
import { redis } from './utils';
import dotenv from 'dotenv';

dotenv.config();
const HTTP_PORT = process.env.SERVER_HTTP_PORT;

(async () => {
  const lang = await new Langs().get(10);
  const category = await new Categories().get(1);
  const country = await new Countries().get(1);
  const article = await new Articles().get(266683);

  await redis.quit();

  console.log({ lang, category, country, article });
})();

// http
//   .createServer(async (req, res) => {
//     await processRoute(req, res);
//   })
//   .listen(HTTP_PORT, () => {
//     console.log(`HTTP-server running at http://localhost:${HTTP_PORT}/`);
//   })
//   .on('error', (err) => {
//     if (err.code === 'EACCES') {
//       console.log(`No access to port: ${HTTP_PORT}`);
//     }
//   });
