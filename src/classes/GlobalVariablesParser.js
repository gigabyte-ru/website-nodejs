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
  static UPDATED_AT = 'updated_at';

  static SRC_PATH = `${process.env.INSTALLED_PATH}src`;
  static dbName = 'u15824_logs';
  static dbTable = 'db_change_log';

  /**
   * @typedef GlobalClasses
   * @type { Object }
   * @property { Langs } langs
   * @property { Categories } categories
   * @property { Countries } countries
   * @property { Articles } aliases
   * @property { Hosts } hosts
   * @property { Sockets } sockets
   */

  /**
   * @type { GlobalClasses }
   */
  classes = {};

  runUpdate() {
    setInterval(() => {
      this.runUpdateProcess().then();
    }, 1000 * 10);

    return this;
  }

  lib() {
    return redis.lib(
      `${GlobalVariablesParser.dbName}:${GlobalVariablesParser.dbTable}`
    );
  }

  /**
   * @param { string } updatedAt
   */
  async setUpdatedAt(updatedAt) {
    await this.lib().add(GlobalVariablesParser.UPDATED_AT, updatedAt);

    return this;
  }

  /**
   * @return {Promise<string>}
   */
  async getUpdatedAt(updatedAt) {
    return await this.lib().get(GlobalVariablesParser.UPDATED_AT);
  }

  async updateLastTimestamp() {
    const updatedAt =
      (
        await getDataFromDb({
          query: `SELECT \`updatedAt\` FROM \`${GlobalVariablesParser.dbTable}\` ORDER BY \`id\` DESC LIMIT 1`,
          dbName: GlobalVariablesParser.dbName,
        })
      )?.[0]?.['updatedAt'] ?? null;

    await this.setUpdatedAt(updatedAt);

    return this;
  }

  async init() {
    await redis.clear();

    // await this.updateLastTimestamp();
    // this.classes.langs = await (await new Langs().createIndexes()).fill();
    // this.classes.categories = await (
    //   await new Categories().createIndexes()
    // ).fill();
    // this.classes.countries = await (
    //   await new Countries().createIndexes()
    // ).fill();
    // this.classes.hosts = await (await new Hosts().createIndexes()).fill();
    // this.classes.sockets = await (await new Sockets().createIndexes()).fill();
    // this.classes.aliases = await (await new Articles().createIndexes()).fill();

    // this.classes.products = (
    //   await new Products(this.variables.categories).fill()
    // ).log();
    // this.classes.productsImages = (await new ProductImages().fill()).log();
    // this.classes.productFiles = (await new ProductFiles().fill()).log();
    // this.classes.productCpus = (await new ProductCpus().fill()).log();

    return this;
  }

  async runUpdateProcess() {
    const updatedAt = this.updatedAt;

    this.updateLastTimestamp().then();

    const changeLogsEntities = await this.getLastUpdated(updatedAt);

    console.log({ changeLogsEntities });

    if (changeLogsEntities?.length) {
      for (const className of Object.keys(this.classes)) {
        await this.classes[className].update(changeLogsEntities);
      }
    }
  }

  /**
   * @return { Promise<Array<ChangeLog> | null> }
   */
  async getLastUpdated(updatedAt) {
    if (!updatedAt) {
      return null;
    }

    console.log('UpdatedAt: ', updatedAt);

    const changeLogs = await getDataFromDb({
      query: `SELECT * FROM \`${GlobalVariablesParser.dbTable}\` WHERE \`updatedAt\` > ? ORDER BY \`updatedAt\` ASC`,
      prepareParams: [updatedAt],
      dbName: GlobalVariablesParser.dbName,
    });

    return changeLogs.map((c) => new ChangeLog().setDataFromDb(c));
  }
}
