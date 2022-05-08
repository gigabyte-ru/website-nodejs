export const asyncReplace = async (str, regexp, asyncFn) => {
  const promises = [];

  str.replace(regexp, (...args) => {
    const promise = asyncFn(...args);
    promises.push(promise);
  });

  const data = await Promise.all(promises);
  return str.replace(regexp, () => data.shift());
}