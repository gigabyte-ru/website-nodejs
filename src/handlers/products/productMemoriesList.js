import { ProductsList } from "../../classes";


const concatDiff = (arr, arrWithDiff, concatFn) => {
  for (const item of arrWithDiff) {
    if (!arr.find((el) => concatFn(el, item))) {
      arr.push(item);
    }
  }
 }

/**
 * @param { CurrentSession } currentSession 
 */
export const productMemoriesTable = async (currentSession) => {
  const { route: { params: { productId } } } = currentSession

  const productsList = new ProductsList();

  const defaultMemories = {
    headers: [],
    items: []
  }

  const product = await productsList.get(productId);

  if (!product) {
    return JSON.stringify(defaultMemories, null, '  ');
  }

  await product.setMemories();
  await product.setMemorySummary();

  const createdMemories = product.memoryList?.reduce(
    (acc, m) => {
      const createdMemory = m.specsAndProps.reduce(
        (accChild, mChild) => {
          const { headers, item } = accChild;

          const { data: { id: specId, name, sorder }, parent } = mChild.memorySpec

          const parentName = parent?.data?.name ?? null

          headers.push({
            specId,
            name,
            parentName,
            sorder
          });

          item[specId] = mChild.memorySpecProp.data.name;

          return accChild;
        },
        {
          headers: [],
          item: {}
        }
      );

      concatDiff(acc.headers, createdMemory.headers, (a, b) => a.specId === b.specId);

      acc.items.push(createdMemory.item);

      return acc;
    },
    defaultMemories
  ) ?? defaultMemories;

  createdMemories.headers.sort((a, b) => { a.sorder - b.sorder });

  createdMemories.memorySummary = product.memorySummary?.data?.name ?? '';

  return JSON.stringify(createdMemories, null, '  ');

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Gigabyte</title>
// </head>
// <body>
//   <h1>This page is /</h1>
//   <div>[#intel_high_definition_audio_enables_8_channel.abstract#]</div>
//   <div>[#269140#]</div>
// </body>
// </html>`;
}