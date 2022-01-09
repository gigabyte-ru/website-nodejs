import { readFile } from 'fs/promises';

export const readTemplateFile = async (filePath) => {
  try {
    return await readFile(filePath, { encoding: 'UTF-8' });
  } catch (e) {
    console.error(e);
    return '';
  }
};
