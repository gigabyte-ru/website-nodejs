export const parseTemplateBlocks = async (templateString, blocks) => {
  return templateString.replace(
    /<!--.*?\[\[\W*?(\w+)?\W*?\]\].?-->/g,
    (...args) => {
      return args[1] in blocks ? blocks[args[1]] : args[0];
    }
  );
};
