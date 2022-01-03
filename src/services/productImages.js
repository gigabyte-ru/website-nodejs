import axios from 'axios';
import { DB } from '../utils/db.js';

const hqUrl = 'https://global-test.gigabyte.com/json/ProductImages?id=';

/**
 * Get product images from HQ and save it into RU-db.
 * If productId === null then script will be get images from ALL products!
 * @param productId
 */
export const getProductImages = async (productId = null) => {
  const db = await DB().connect('u15821_products');

  let productsQuery =
    'SELECT `id`, `original_id` FROM `products` WHERE `original_id` > 0';

  if (productId) {
    productsQuery = `${productsQuery} AND \`id\` = '${productId}'`;
  }

  const products = await db.query(productsQuery);

  for (const product of products) {
    const finalUrl = `${hqUrl}${product['original_id']}`;
    console.log(finalUrl);

    const response = await axios.get(finalUrl);
    if (!response?.data) {
      continue;
    }

    const content = response?.data;
    if (!content?.['Products']?.['FileData']) {
      continue;
    }

    const imagesForInsert = content?.['Products']?.['FileData'];
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
      console.log('Delete images ', imagesForDelete);

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
  }

  await db.disconnect();
};
