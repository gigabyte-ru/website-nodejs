import { DB } from '../utils/db.js';
import getUrl from '../utils/getUrl.js';

const HQ_URL = 'https://global-test.gigabyte.com/json/ProductImages?id=';

const db = await DB().connect('u15821_products');

/**
 * Get product images from HQ and save it into RU-db.
 * If productId === null then script will be get images from ALL products!
 */
export default async (product) => {
  const finalUrl = `${HQ_URL}${product['original_id']}`;
  console.log(product, finalUrl);

  const response = await getUrl(finalUrl);

  if (!response?.data) {
    return;
  }

  const content = response?.data;
  if (!content?.['Products']?.['FileData']) {
    return;
  }

  const imagesForInsert = content['Products']['FileData'];

  console.log('Images: ', imagesForInsert.length);

  const prevImages = await db.query(
    `SELECT * FROM \`product_images_originals\` WHERE \`product_id\` = ?`,
    [product['id']]
  );

  for (const prevImage of prevImages) {
    prevImage.isEqual = false;
    const equalImageIndex = imagesForInsert.findIndex(
      (i) => i?.['Path'] === prevImage['path']
    );
    if (equalImageIndex >= 0) {
      prevImage.isEqual = true;
      imagesForInsert.splice(equalImageIndex, 1);
    }
  }

  const imagesForDelete = prevImages
    .filter((i) => !i.isEqual)
    ?.map((i) => i.id);

  if (imagesForDelete.length) {
    console.log('Delete images: ', imagesForDelete);

    await db.query(
      `DELETE FROM \`product_images_originals\` WHERE \`id\` IN (${imagesForDelete.join(
        ','
      )})`
    );
  }

  for (const imageForInsert of imagesForInsert) {
    const result = await db.query(
      `INSERT INTO \`product_images_originals\` SET \`product_id\` = ?, \`extension\` = ?, \`path\` = ?`,
      [product['id'], imageForInsert['Extension'], imageForInsert['Path']]
    );

    if (result?.affectedRows) {
      console.log(
        `Image with path = '${imageForInsert['Path']}' was added to productId = '${product['id']}'`
      );
    }
  }
};
