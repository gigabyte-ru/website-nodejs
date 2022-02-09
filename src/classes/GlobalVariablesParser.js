import dotenv from 'dotenv';

import { getDataFromDb, redis } from '../utils';
import {
  Articles,
  Categories,
  Countries,
  Langs,
  Hosts,
  Sockets,
} from './lists';
import { ChangeLog } from './entities';

dotenv.config();

export class GlobalVariablesParser {
  static UPDATED_AT = 'updatedAt';

  static SRC_PATH = `${process.env.INSTALLED_PATH}src`;
  static dbName = 'u15824_logs';
  static dbTable = 'db_change_log';

  /**
   * @typedef GlobalClasses
   * @type { Object }
   * @property { Articles } articles
   * @property { Categories } categories
   * @property { Countries } countries
   * @property { Hosts } hosts
   * @property { Langs } langs
   * @property { Sockets } sockets
   */

  /**
   * @type { GlobalClasses }
   */
  classes = {
    articles: new Articles(),
    categories: new Categories(),
    countries: new Countries(),
    hosts: new Hosts(),
    langs: new Langs(),
    sockets: new Sockets(),
  };

  lib = redis.lib(
    `${GlobalVariablesParser.dbName}:${GlobalVariablesParser.dbTable}`
  );

  runUpdate() {
    setInterval(() => {
      this.runUpdateProcess().then();
    }, 1000 * 10);

    return this;
  }

  async init() {
    await this.setUpdatedAt(await this.getUpdatedAtFromDb());

    for (const classEntity of Object.values(this.classes)) {
      await classEntity.fill();
    }

    return this;
  }

  /**
   * @param { string } updatedAt
   */
  async setUpdatedAt(updatedAt) {
    await this.lib.add(GlobalVariablesParser.UPDATED_AT, updatedAt);

    return this;
  }

  /**
   * @return {Promise<string>}
   */
  async getUpdatedAt() {
    return await this.lib.get(GlobalVariablesParser.UPDATED_AT);
  }

  /**
   * @return {Promise<string | null>}
   */
  async getUpdatedAtFromDb() {
    return (
      (
        await getDataFromDb({
          query: `SELECT \`updatedAt\` FROM \`${GlobalVariablesParser.dbTable}\` ORDER BY \`id\` DESC LIMIT 1`,
          dbName: GlobalVariablesParser.dbName,
        })
      )?.[0]?.['updatedAt'] ?? null
    );
  }

  async clearStorage() {
    await redis.clear();

    return this;
  }

  async createIndexes() {
    for (const classEntity of Object.values(this.classes)) {
      await classEntity.createIndexes();
    }

    return this;
  }

  async runUpdateProcess() {
    const changeLogsEntities = await this.getLastChangeLogs();

    console.log({ changeLogsEntities });

    if (changeLogsEntities?.length) {
      await this.setUpdatedAt(
        changeLogsEntities[changeLogsEntities.length - 1].updatedAt
      );

      for (const classEntity of Object.values(this.classes)) {
        await classEntity.update(changeLogsEntities);
      }
    }
  }

  /**
   * @return { Promise<Array<ChangeLog> | null> }
   */
  async getLastChangeLogs() {
    const updatedAt = await this.getUpdatedAt();

    if (!updatedAt) {
      return null;
    }

    const changeLogs = await getDataFromDb({
      query: `SELECT * FROM \`${GlobalVariablesParser.dbTable}\` WHERE \`updatedAt\` > ? ORDER BY \`updatedAt\` ASC`,
      prepareParams: [updatedAt],
      dbName: GlobalVariablesParser.dbName,
    });

    return changeLogs.map((c) => new ChangeLog().setDataFromDb(c));
  }
}
