export const getArrayFromObject = (object) =>
  Object.keys(object).map((key) => object[key]);
