import { DB } from '../utils/db.js';
import getUrl from '../utils/getUrl.js';

const HQ_URL = 'https://global-test.gigabyte.com/Json/MemorySupport?productid=';

const db = await DB().connect('u15821_products');

const getTableSummaryId = async (summaryText) => {
  const SUMMARY_TABLE = 'memory_summaries';

  const query = `SELECT \`id\` FROM ${SUMMARY_TABLE} WHERE \`name\` = ?`;
  
  let summaryId = (await db.query(query, [summaryText]))?.[0]?.id ?? null;

  if (!summaryId) {
    console.log('Add new summary!');

    const query = `INSERT INTO ${SUMMARY_TABLE} SET \`name\` = ?`;
    summaryId = (await db.query(query, [summaryText]))?.insertId ?? null;
  }

  return summaryId;
}

const getMemorySpecId = async (header, parentId = null) => {
  const HEADERS_TABLE = 'memory_specs';
  let memorySpecId = null;

  const selectQuery = `SELECT \`id\`, \`name\`, \`parent_id\` FROM ${HEADERS_TABLE} WHERE \`original_id\` = ?`;
  let memorySpec = (await db.query(selectQuery, [header.TitleId]))?.[0] ?? null;
  memorySpecId = memorySpec?.id ?? null

  let query = `${HEADERS_TABLE} SET \`name\` = ?, \`sorder\` = ?, \`original_id\` = ?`;
  const prepareParams = [header.Value, header.ColumnSort, header.TitleId];
  if (parentId) {
    query = `${query}, \`parent_id\` = ?`;
    prepareParams.push(parentId);
  }

  if (!memorySpecId) {
    console.log('Add new spec!');

    query = `INSERT INTO ${query}`;
    memorySpecId = (await db.query(query, prepareParams))?.insertId ?? null;

  } else if (memorySpec.name !== header.Value || (parentId && memorySpec['parent_id'] !== parentId)) {
    console.log(`Update spec ${memorySpec.name}`);

    query = `UPDATE ${query} WHERE \`id\` = ?`;
    prepareParams.push(memorySpecId);

    console.log({ query, prepareParams });

    await db.query(query, prepareParams);
  }

  return memorySpecId;
}

const getHeaders = async (tableHeaders) => {
  const parents = [];
  const headers = [];

  for (const headerObj of tableHeaders) {
    const index = headerObj.ColumnSort;
    const parent = parents.find(p => p.minIndex <= index && p.maxIndex > index);

    const memorySpecId = await getMemorySpecId(headerObj, parent?.memorySpecId ?? null);

    if (headerObj.ColSpan > 1) {
      parents.push({
        ...headerObj,
        minIndex: index,
        maxIndex: index + headerObj.ColSpan,
        memorySpecId
      })
    } else {
      headers.push({
        ...headerObj,
        memorySpecId
      })
    }
  }

  return headers;
}

const getMemorySpecPropId = async (column, memorySpecId) => {
  const SPEC_PROPS_TABLE = 'memory_spec_props';
  let memorySpecPropId = null

  const query = `SELECT * FROM \`${SPEC_PROPS_TABLE}\` WHERE \`name\` = ? AND \`memory_spec_id\` = ?`;
  memorySpecPropId = (await db.query(query, [column.Value, memorySpecId]))?.[0]?.id ?? null;

  if (!memorySpecPropId) {
    console.log('Add new prop!');
    const query = `INSERT INTO \`${SPEC_PROPS_TABLE}\` SET \`name\` = ?, \`memory_spec_id\` = ?`;

    memorySpecPropId = (await db.query(query, [column.Value, memorySpecId]))?.insertId ?? null;
  }

  return memorySpecPropId;
}

const getMemoryId = async (columns, headers) => {
  const MEMORY_SPEC_PROP_TABLE = 'memoryHasSpecsHasProps';
  const MEMORY_TABLE = 'memories';
  const specProps = [];
  let memoryName = '';
  
  for (const column of columns) {
    const memorySpec = headers.find(h => h.ColumnSort == column.ColumnSort);
    const memorySpecId = memorySpec.memorySpecId;

    if (memorySpec.TitleId === 5) {
      memoryName = column.Value;
    }

    const memorySpecPropId = await getMemorySpecPropId(column, memorySpecId);
    specProps.push({ memorySpecId, memorySpecPropId });
  }

  const specPropString = specProps.map(p => p.memorySpecPropId).join('_');

  const query = `SELECT *, GROUP_CONCAT(\`memory_spec_prop_id\` SEPARATOR '_') AS propString FROM \`${MEMORY_SPEC_PROP_TABLE}\` GROUP BY \`memory_id\` HAVING  \`propString\` = ?`;
  let memoryId = (await db.query(query, [specPropString]))?.[0]?.memory_id ?? null;

  if (!memoryId) {
    const insertQuery = `INSERT INTO \`${MEMORY_TABLE}\` SET \`name\` = ?`;
    memoryId = (await db.query(insertQuery, [memoryName]))?.insertId ?? null;

    console.log(`Add new memory: ${memoryId}`);

    for (const { memorySpecId, memorySpecPropId } of specProps) {
      console.log(`Add new link memoryId -> memorySpecId -> memorySpecPropId: ${memoryId}_${memorySpecId}_${memorySpecPropId}`);
      const insertQuery = `INSERT INTO \`${MEMORY_SPEC_PROP_TABLE}\` SET \`memory_id\` = ?, \`memory_spec_id\` = ?, \`memory_spec_prop_id\` = ?`;
      await db.query(insertQuery, [memoryId, memorySpecId, memorySpecPropId]);
    }
  }

  return memoryId;
}

const updateProductMemorySummary = async (productId, memorySummaryId) => {
  const PRODUCTS_TABLE = 'products';

  const query = `UPDATE \`${PRODUCTS_TABLE}\` SET \`memory_summary_id\` = ? WHERE \`id\` = ?`;
  await db.query(query, [memorySummaryId, productId]);
}

const updateProductMemory = async (productId, memoryId) => {
  const PRODUCT_MEMORY_TABLE = 'product_memories';

  const query = `SELECT * FROM \`${PRODUCT_MEMORY_TABLE}\` WHERE \`product_id\` = ? AND \`memory_id\` = ?`;
  const productMemory = await db.query(query, [productId, memoryId]);

  if (!productMemory.length) {
    console.log('Add memory to product');
    const query = `INSERT INTO \`${PRODUCT_MEMORY_TABLE}\` SET \`product_id\` = ?, \`memory_id\` = ?`;
    await db.query(query, [productId, memoryId]);
  }
}

const unlinkMemoryNotIncludedIn = async (productId, includedIds) => {
  const PRODUCT_MEMORY_TABLE = 'product_memories';

  const query = `DELETE FROM \`${PRODUCT_MEMORY_TABLE}\` WHERE \`product_id\` = ? AND \`memory_id\` NOT IN (${includedIds.join(',')})`;

  await db.query(query, [productId]);
}

/**
 * Get product memory support list.
 * If productId === null then script will be get memory list for ALL products!
 */
export default async (product) => {
  const finalUrl = `${HQ_URL}${product['original_id']}`;
  console.log(product, finalUrl);

  const response = await getUrl(finalUrl);

  if (!response?.data || !response?.data?.length) {
    return;
  }

  const content = response.data[0];

  if (!content['TableHeader'] || !content['TableBodyRows']) {
    return
  }

  const tableSummary = content['TableSummary'] ?? '';
  const tableHeaders = content['TableHeader'];
  const tableRows = content['TableBodyRows'];

  const memorySummaryId = await getTableSummaryId(tableSummary);

  updateProductMemorySummary(product['id'], memorySummaryId);

  const headers = await getHeaders(tableHeaders);

  const memoriesIds = []

  for (const row of tableRows) {
    const memoryId = await getMemoryId(row['Columns'], headers);
    memoriesIds.push(memoryId);
    await updateProductMemory(product['id'], memoryId);
  }

  await unlinkMemoryNotIncludedIn(product['id'], memoriesIds);
}