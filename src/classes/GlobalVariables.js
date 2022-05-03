import dotenv from 'dotenv';

import { getDataFromDb, redis } from '../utils';
import { ChangeLog } from './entities';
import {
  ArticlesList,
  CategoriesList,
  CountriesList,
  CpuHasSpecHasPropList,
  CpuList,
  CpuSpecPropsList,
  CpuSpecsList,
  FileGroupsList,
  FileHasOsList,
  FilesList,
  FileTypesList,
  HostsList,
  HtmlBlocksList,
  LangsList,
  OsList,
  ProductHasCpuList,
  ProductHasFilesList,
  ProductHasHtmlBlocksList,
  ProductImagesList,
  ProductsList,
  SocketsList,
} from './lists';
import { MemoryHasSpecHasPropList } from './lists/MemoryHasSpecHasPropList';
import { MemoryList } from './lists/MemoryList';
import { MemorySpecPropsList } from './lists/MemorySpecPropsList';
import { MemorySpecsList } from './lists/MemorySpecsList';
import { MemorySummariesList } from './lists/MemorySummariesList';
import { ProductHasMemoryList } from './lists/ProductHasMemoryList';

dotenv.config();

/**
 * @typedef GlobalClasses
 * @type { Object }
 * @property { ArticlesList } articlesList
 * @property { CategoriesList } categoriesList
 * @property { CountriesList } countriesList
 * @property { CpuHasSpecHasPropList } cpuHasSpecHasPropList
 * @property { CpuList } cpuList
 * @property { CpuSpecPropsList } cpuSpecPropsList
 * @property { CpuSpecsList } cpuSpecsList
 * @property { FileGroupsList } fileGroupsList
 * @property { FileHasOsList } fileHasOsList
 * @property { FilesList } filesList
 * @property { FileTypesList } fileTypesList
 * @property { HostsList } hostsList
 * @property { HtmlBlocksList } htmlBlocksList
 * @property { LangsList } langsList
 * @property { MemoryHasSpecHasPropList } memoryHasSpecHasPropList
 * @property { MemoryList } memoryList
 * @property { MemorySpecPropsList } memorySpecPropsList
 * @property { MemorySpecsList } memorySpecsList
 * @property { MemorySummariesList } memorySummariesList
 * @property { OsList } osList
 * @property { ProductHasCpuList } productHasCpuList
 * @property { ProductHasFilesList } productHasFilesList
 * @property { ProductHasHtmlBlocksList } productHasHtmlBlocksList
 * @property { ProductHasMemoryList } productHasMemoryList
 * @property { ProductImagesList } productImagesList
 * @property { ProductsList } productsList
 * @property { SocketsList } socketsList
 */

export class GlobalVariables {
  static UPDATED_AT = 'updatedAt';

  static SRC_PATH = `${process.env.INSTALLED_PATH}src`;
  static dbName = 'u15824_logs';
  static dbTable = 'db_change_log';

  lib = redis.lib(`${GlobalVariables.dbName}:${GlobalVariables.dbTable}`);

  /**
   * @type { GlobalClasses }
   */
  entitiesLists = {
    articlesList: new ArticlesList(),
    categoriesList: new CategoriesList(),
    countriesList: new CountriesList(),
    cpuHasSpecHasPropList: new CpuHasSpecHasPropList(),
    cpuList: new CpuList(),
    cpuSpecPropsList: new CpuSpecPropsList(),
    cpuSpecsList: new CpuSpecsList(),
    fileGroupsList: new FileGroupsList(),
    fileHasOsList: new FileHasOsList(),
    filesList: new FilesList(),
    fileTypesList: new FileTypesList(),
    hostsList: new HostsList(),
    htmlBlocksList: new HtmlBlocksList(),
    langsList: new LangsList(),
    memoryHasSpecHasPropList: new MemoryHasSpecHasPropList(),
    memoryList: new MemoryList(),
    memorySpecPropsList: new MemorySpecPropsList(),
    memorySpecsList: new MemorySpecsList(),
    memorySummariesList: new MemorySummariesList(),
    osList: new OsList(),
    productHasCpuList: new ProductHasCpuList(),
    productHasFilesList: new ProductHasFilesList(),
    productHasHtmlBlocksList: new ProductHasHtmlBlocksList(),
    productHasMemoryList: new ProductHasMemoryList(),
    productImagesList: new ProductImagesList(),
    productsList: new ProductsList(),
    socketsList: new SocketsList(),
  };

  runUpdate() {
    setInterval(() => {
      this.runUpdateProcess().then();
    }, 1000 * 10);

    return this;
  }

  async init() {
    const updatedAtFromDb = await this.getUpdatedAtFromDb();
    console.log(`Start init at ${updatedAtFromDb}`);

    await this.setUpdatedAt(updatedAtFromDb);

    for (const entityList of Object.values(this.entitiesLists)) {
      await entityList.fill();
    }

    return this;
  }

  /**
   * @param { string } updatedAt
   */
  async setUpdatedAt(updatedAt) {
    await this.lib.add(GlobalVariables.UPDATED_AT, updatedAt);

    return this;
  }

  /**
   * @return {Promise<string>}
   */
  async getUpdatedAt() {
    const updatedAt = await this.lib.get(GlobalVariables.UPDATED_AT);
    if (updatedAt && typeof updatedAt === 'string') {
      const date = new Date(updatedAt);
      return new Date(
        date.getTime() - date.getTimezoneOffset() * 60 * 1000
      ).toISOString();
    }

    return null;
  }

  /**
   * @return {Promise<string | null>}
   */
  async getUpdatedAtFromDb() {
    return (
      (
        await getDataFromDb({
          query: `SELECT \`updatedAt\` FROM \`${GlobalVariables.dbTable}\` ORDER BY \`id\` DESC LIMIT 1`,
          dbName: GlobalVariables.dbName,
        })
      )?.[0]?.['updatedAt'] ?? null
    );
  }

  async clearStorage() {
    await redis.clear();

    return this;
  }

  async createIndexes() {
    for (const entityList of Object.values(this.entitiesLists)) {
      await entityList.createIndexes();
    }

    return this;
  }

  async createTriggers() {
    for (const entityList of Object.values(this.entitiesLists)) {
      await entityList.createTriggers();
    }

    return this;
  }

  async runUpdateProcess() {
    const changeLogsEntities = await this.getLastChangeLogs();

    if (changeLogsEntities?.length) {
      await this.setUpdatedAt(
        changeLogsEntities[changeLogsEntities.length - 1].updatedAt
      );

      for (const entityList of Object.values(this.entitiesLists)) {
        await entityList.update(changeLogsEntities);
      }
    }
  }

  /**
   * @return { Promise<Array<ChangeLog> | null> }
   */
  async getLastChangeLogs() {
    const updatedAt = await this.getUpdatedAt();

    console.log('LastChangeLogs: ', updatedAt);

    if (!updatedAt) {
      return null;
    }

    const changeLogs = await getDataFromDb({
      query: `SELECT * FROM \`${GlobalVariables.dbTable}\` WHERE \`updatedAt\` > ? ORDER BY \`updatedAt\` ASC`,
      prepareParams: [updatedAt],
      dbName: GlobalVariables.dbName,
    });

    return changeLogs?.map((c) => new ChangeLog().setDataFromDb(c)) ?? [];
  }
}
