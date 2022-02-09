import http from 'http';
import { processRoute } from './utils';
import {
  ArticlesList,
  CategoriesList,
  CountriesList,
  LangsList,
} from './classes';
import { redis } from './utils';
import dotenv from 'dotenv';

dotenv.config();
const HTTP_PORT = process.env.SERVER_HTTP_PORT;

(async () => {
  const lang = await new LangsList().get(10);
  const category = await new CategoriesList().get(1);
  const country = await new CountriesList().get(1);
  const article = await new ArticlesList().get(266683);

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
