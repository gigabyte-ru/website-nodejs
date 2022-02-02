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

export class GlobalVariablesParser {
  updatedAt = null;

  static SRC_PATH = `${process.env.INSTALLED_PATH}src`;
  static dbLogsName = 'u15824_logs';
  static dbTablesLogsName = 'db_change_log';

  classes = {};

  async updateLastTimestamp() {
    this.updatedAt =
      (
        await getDataFromDb({
          query: `SELECT \`updatedAt\` FROM \`${GlobalVariablesParser.dbTablesLogsName}\` ORDER BY \`id\` DESC LIMIT 1`,
          dbName: GlobalVariablesParser.dbLogsName,
        })
      )?.[0]?.['updatedAt'] ?? null;
  }

  async init() {
    await this.updateLastTimestamp();
    this.classes.langs = (await new Langs().fill()).log();
    // this.classes.hosts = (await new Hosts().fill()).log();
    // this.classes.countries = (await new Countries().fill()).log();
    // this.classes.translations = (
    //   await new Translations(this.variables.langs).fill()
    // ).log();
    // this.classes.categories = (await new Categories().fill()).log();
    // this.classes.sockets = (await new Sockets().fill()).log();
    // this.classes.products = (
    //   await new Products(this.variables.categories).fill()
    // ).log();
    // this.classes.productsImages = (await new ProductImages().fill()).log();
    // this.classes.productFiles = (await new ProductFiles().fill()).log();
    // this.classes.productCpus = (await new ProductCpus().fill()).log();

    return this;
  }

  runUpdate() {
    setInterval(() => {
      this.runUpdateProcess().then();
    }, 1000 * 10);

    return this;
  }

  async runUpdateProcess() {
    this.classes.langs.get(1).alias = 'asdsadad';
    console.log({ workerEn: this.classes.langs.get(1) });

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
      query: `SELECT * FROM \`${GlobalVariablesParser.dbTablesLogsName}\` WHERE \`updatedAt\` > ? ORDER BY \`updatedAt\` ASC`,
      prepareParams: [updatedAt],
      dbName: GlobalVariablesParser.dbLogsName,
    });

    return changeLogs.map((c) => new ChangeLog(c));
  }
}
