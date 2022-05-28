import { TemplatesList } from "../classes/lists/TemplatesList";
import { asyncReplace } from "./asyncReplace";
import { parseTemplateVariables } from "./parseTemplateVariables";

export const parseTemplateBlocks = async (templateString, variables = {}) => {
  const templatesList = new TemplatesList();

  return await asyncReplace(templateString, /<!--.*?\[\[\W*?(\w+)?\W*?\]\].?-->/g, 
      async (...args) => {
        const blockName = args[1];
        console.log(blockName);

        const templateEntity = await templatesList.getEntityByAlias(blockName);

        const parsedTemplateEntityContent = await parseTemplateBlocks(templateEntity?.data?.content ?? '', variables) ?? '';

        return parseTemplateVariables(parsedTemplateEntityContent, variables) ?? '';
      }
  );
};
