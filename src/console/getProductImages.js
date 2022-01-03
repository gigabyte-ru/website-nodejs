import { getProductImages } from '../services/productImages.js';
import { getValueFromArgv } from '../utils/getValueFromArgv.js';

const productId = getValueFromArgv('productId', (val) =>
  Number.isInteger(+val) ? Number(val) : null
);

getProductImages(productId).then();
