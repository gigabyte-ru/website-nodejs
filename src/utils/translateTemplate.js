export const translateTemplate = (templateString, currentSession) => {
  return templateString.replace(/\[#(.+?)#\]/g, (...args) => {
    const { translations } = currentSession;
    const alias = args[1].split('.');

    const aliasKey = alias[0];

    const translation = translations.first.has(aliasKey)
      ? translations.first.get(aliasKey)
      : translations.second.has(aliasKey)
      ? translations.second.get(aliasKey)
      : translations.default.has(aliasKey)
      ? translations.default.get(aliasKey)
      : null;

    if (translation) {
      if (alias[1]) {
        return translation[alias[1]];
      }
      return translation['name'];
    }

    return args[0];
  });
};
