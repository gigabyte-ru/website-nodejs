'use strict';

import http from 'http';
import dotenv from 'dotenv';
import { opendir, readFile, realpath } from 'fs/promises';

import { GlobalVariables } from './classes/globalVariables.js';
import { processRoute } from './utils/processRoute.js';

dotenv.config();
const HTTP_PORT = process.env.SERVER_HTTP_PORT;

// 1. Get global variables
// Need to run `node --expose-gc ./server.js`
const globalVariables = {};
// const globalVariables = await new GlobalVariables().init();

http
  .createServer(async (req, res) => {
    processRoute(req, res, globalVariables);
  })
  .listen(HTTP_PORT, () => {
    console.log(`HTTP-server running at http://localhost:${HTTP_PORT}/`);
  })
  .on('error', (err) => {
    if (err.code === 'EACCES') {
      console.log(`No access to port: ${HTTP_PORT}`);
    }
  });

/*
const handlers = {
    '/': () => openIndexFile('/'),
    '/products/': () => openIndexFile('/products'),
}

const getTranslationFromFile = async (lang) => {
    try {
        const translation = await readFile(`translate/${lang}.json`);
        return JSON.parse(String(translation));
    } catch {
        return {}
    }
}

const langsFromHost = (host) => {
    return ['ru', 'en'];
}

const translator = (alias, langs) => {
    const aliasKey = alias.replace('[#', '').replace('#]', '');

    let translation = null;

    for (const lang of langs) {
        translation = translations?.[lang]?.[aliasKey];
        if (translation) break;
    }

    return translation ?? alias;
}

const translate = async (handler, host, args) => {
    const langs = langsFromHost(host);

    for (const lang of langs) {
        if (!translations[lang]) {
            translations[lang] = await getTranslationFromFile(lang);
            console.log(translations[lang]);
        }
    }

    const data = await handler(args);
    return String(data).replace(/\[\#.+?\#\]/g, (str) => translator(str, langs));
}

const getHandlerByRoute = (url, { host }) => {
    const clearUrl = addSlash(url)
    const handler = handlers[clearUrl];

    if (!handler) {
        return null;
    }

    return (args) => translate(handler, host, args);
}

const addSlash = (url) => {
    const endSymbol = url[url.length-1] === '/' ? '' : '/';
    return `${url}${endSymbol}`;
}

const openIndexFile = async (url) => {
    const mainDir = addSlash(TEMPLATES_DIR);
    const path = addSlash(url);
    const filePath = `${mainDir}${path}index.html`;

    return await readFile(filePath);
}

const urlArgsToObject = (args) => {
	const obj = {};
	for (const arg of args.split('&')) {
		const [param, value] = arg.split('=');
		obj[param] = value;
	}
	return obj;
}

const receiveArgs = async req => new Promise(resolve => {
  const body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', async () => {
    const data = body.join('');
    const args = urlArgsToObject(data);
    resolve(args);
  });
});

const httpServer = http.createServer(async (req, res) => {
	const handler = getHandlerByRoute(req.url, req.headers);
	try {
		if (handler) {
			const args = await receiveArgs(req);
			res.statusCode = 200;
			//res.setHeader('Content-Type', 'text/plain');
			const result = await handler(args);
			res.end(result);
		} else {
			res.statusCode = 404;
			res.end('Page is not found');
		}
	} catch(e) {
		console.log(e);
		res.statusCode = 500;
		res.end('Server error');
	}

});

httpServer
  .listen(HTTP_PORT, () => {
    console.log(`Server running at http://localhost:${HTTP_PORT}/`);
  })
  .on('error', err => {
    if (err.code === 'EACCES') {
      console.log(`No access to port: ${HTTP_PORT}`);
    }
  });
*/
