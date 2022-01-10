export const parseTemplateVariables = async (templateString, variables) => {
  return templateString.replace(/#{\W*?(\w+)?\W*?}/g, (...args) => {
    return args[1] in variables ? variables[args[1]] : args[0];
  });
};
