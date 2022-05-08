import { asyncReplace } from "./asyncReplace";

/**
 * @param { string } templateString 
 * @param { CurrentSession } currentSession 
 * @returns 
 */
export const translateTemplate = async (templateString, currentSession) => {
  return await asyncReplace(templateString, /\[#(.+?)#\]/g, 
      async (...args) => {
        const { articlesList, host: { data: { firstLangId, secondLangId, defaultLangId } } } = currentSession;

        const alias = args[1].split('.');

        const aliasKey = alias[0];

        let translation = await articlesList.getTranslation(firstLangId, aliasKey);

        if (!translation) {
          translation = await articlesList.getTranslation(secondLangId, aliasKey);
        }
        if (!translation) {
          translation = await articlesList.getTranslation(defaultLangId, aliasKey);
        }

        if (translation) {
          if (alias[1]) {
            return translation.data[alias[1]];
          }
          return translation.data['name'];
        }

        return args[0];
      }
  );
};
