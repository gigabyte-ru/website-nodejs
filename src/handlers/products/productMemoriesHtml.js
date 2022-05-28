import { GlobalVariables } from "../../classes/GlobalVariables";
import { readTemplateFile } from "../../utils";

export default async (currentSession) => {
  const template = `${GlobalVariables.SRC_PATH}/templates/api/memorySupportList.html`;

  return await readTemplateFile(template);
}