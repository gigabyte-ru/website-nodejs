import { DB } from './db.js';

export const initGlobal = async (globalVariables) => {
  // u15821_global
  let db = await DB().connect('u15821_global');
  const domainsDb = await db.query('SELECT * FROM `domains`');
  const langsDb = await db.query('SELECT * FROM `langs`');
  const articlesDb = await db.query('SELECT * FROM `articles`');
  await db.disconnect();

  let updatedAt = new Date();
  const langsData = fillLangs(langsDb);

  globalVariables.langs = { updatedAt, data: langsData };
  globalVariables.hosts = { updatedAt, data: fillHosts(langsData, domainsDb) };
  globalVariables.translations = {
    updatedAt,
    data: fillAliases(langsData, articlesDb),
  };

  // u15821_products
  db = await DB().connect('u15821_products');
  const categoriesDb = await db.query(
    'SELECT * FROM `categories` WHERE `original_id` > 0'
  );
  await db.disconnect();

  updatedAt = new Date();
  const categoriesData = fillCategories(categoriesDb);
  const productsData = await fillProducts(categoriesData);

  globalVariables.categories = { updatedAt, data: categoriesData };
  globalVariables.products = { updatedAt, data: productsData };
};

export const fillLangs = (langsDb = []) => {
  return langsDb.reduce((map, lang) => map.set(lang.id, lang), new Map());
};

export const fillAliases = (langsMap = new Map(), articlesDb = []) => {
  const data = {};

  for (const lang of langsMap.values()) {
    data[lang['alias']] = new Map();
  }

  for (const article of articlesDb) {
    const langAlias = langsMap.get(article['lang_id'])?.['alias'];
    const dataMap = data[langAlias];

    if (!dataMap) {
      continue;
    }

    const alias = {
      name: article.name,
      abstract: article.abstract,
      description: article.description,
      code: article.code,
      link: article.link,
    };
    if (article['alias']) {
      dataMap.set(article['alias'], alias);
    }

    dataMap.set(article['article_id'], alias);
  }

  return data;
};

export const fillHosts = (langsMap = new Map(), domainsDb = []) => {
  const dataMap = new Map();

  for (const domain of domainsDb) {
    const langAlias = langsMap.get(domain['lang_id'])?.['alias'];
    const defaultLangAlias = langsMap.get(domain['default_lang_id'])?.['alias'];
    const vacarialLangAlias = langsMap.get(domain['vicarial_lang_id'])?.[
      'alias'
    ];

    const host = {
      langId: domain['lang_id'],
      langAlias,
      vacarialLangId: domain['vicarial_lang_id'],
      vacarialLangAlias,
      defaultLangId: domain['default_lang_id'],
      defaultLangAlias,
      name: domain['name'],
      countryId: domain['country_id'],
    };

    dataMap.set(domain['name'], host);
  }

  return dataMap;
};

export const fillCategories = (categoriesDb = []) => {
  const categoriesMap = new Map();
  for (const category of categoriesDb) {
    categoriesMap.set(category.id, category);
  }

  return categoriesMap;
};

export const fillProducts = async (categoriesMap = new Map()) => {
  const categories = {};
  for (const category of categoriesMap.values()) {
    categories[category['original_alias']] = new Map();
  }

  const db = await DB().connect('u15821_products');
  const productsDb = await db.query(
    'SELECT * FROM `products` WHERE `original_alias` IS NOT NULL'
  );

  console.log(productsDb.length);

  for (const productDb of productsDb) {
    const categoryAlias = categoriesMap.get(productDb['category_id'])?.[
      'original_alias'
    ];
    const category = categories[categoryAlias];
    if (!category) {
      continue;
    }

    const product = { ...productDb };

    product['images'] = await db.query(
      'SELECT * FROM `product_images_originals` WHERE `product_id` = ?',
      [productDb['id']]
    );
    category.set(product['original_alias'], product);
  }
  await db.disconnect();

  return categories;
};
