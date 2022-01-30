import dotenv from 'dotenv';

import { getDataFromDb } from '../utils';
import { Langs } from './Langs';
import { Hosts } from './Hosts';
import { Translations } from './Translations';
import { Categories } from './Categories';
import { Products } from './Products';
import { Countries } from './Countries';
import { ProductImages } from './ProductImages';
import { ProductFiles } from './ProductFiles';
import { Sockets } from './Sockets';
import { ProductCpus } from './ProductCpus';
import { ChangeLog } from './entities/ChangeLog';

dotenv.config();

export class GlobalVariables {
  updatedAt = null;

  static SRC_PATH = `${process.env.INSTALLED_PATH}src`;
  static dbLogsName = 'u15824_logs';
  static dbTablesLogsName = 'db_change_log';

  variables = {};

  async updateLastTimestamp() {
    this.updatedAt =
      (
        await getDataFromDb({
          query: `SELECT \`updatedAt\` FROM \`${GlobalVariables.dbTablesLogsName}\` ORDER BY \`id\` DESC LIMIT 1`,
          dbName: GlobalVariables.dbLogsName,
        })
      )?.[0]?.['updatedAt'] ?? null;
  }

  async init() {
    await this.updateLastTimestamp();
    this.variables.langs = (await new Langs().fill()).log();
    this.variables.hosts = (await new Hosts().fill()).log();
    this.variables.countries = (await new Countries().fill()).log();
    this.variables.translations = (
      await new Translations(this.variables.langs).fill()
    ).log();
    this.variables.categories = (await new Categories().fill()).log();
    this.variables.sockets = (await new Sockets().fill()).log();
    this.variables.products = (
      await new Products(this.variables.categories).fill()
    ).log();
    this.variables.productsImages = (await new ProductImages().fill()).log();
    this.variables.productFiles = (await new ProductFiles().fill()).log();
    this.variables.productCpus = (await new ProductCpus().fill()).log();

    setInterval(() => {
      this.runUpdateProcess();
    }, 1000 * 60);

    return this;
  }

  async runUpdateProcess() {
    const updatedAt = this.updatedAt;

    this.updateLastTimestamp().then();

    const changeLogsEntities = await this.getLastUpdated(updatedAt);

    console.log(changeLogsEntities);

    for (const className of Object.keys(this.variables)) {
      this.variables[className].update(changeLogsEntities);
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
      query: `SELECT * FROM \`${GlobalVariables.dbTablesLogsName}\` WHERE \`updatedAt\` > ?`,
      prepareParams: [updatedAt],
      dbName: GlobalVariables.dbLogsName,
    });

    return changeLogs.map((c) => new ChangeLog(c));
  }
}

/**
 * All global variables
 */
export const globalVariables = new GlobalVariables();
