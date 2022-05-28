import { FieldTypes } from '../constants';
import { RedisDb } from './RedisDb';
import prepareForRedisStringSearch from '../utils/prepareForRedisStringSearch';

/**
 * @typedef SearchIndexes
 * @type { Record<string, { type: FieldTypes }> }
 */

export class RedisQueryBuilder {
  queries = [];

  /**
   * @param { SearchIndexes } searchIndexes 
   */
  constructor(searchIndexes) {
    this.searchIndexes = searchIndexes;
  }

  /**
   * @param { string } searchIndex 
   * @returns 
   */
  where(searchIndex) {
    const indexType = this.searchIndexes?.[searchIndex]?.type ?? FieldTypes.STRING;

    return {
      isEqual: (value) => {
        switch(indexType) {
          case FieldTypes.STRING:
            this.queries.push(`@${searchIndex}:${prepareForRedisStringSearch(value)}`);
            break;
          case FieldTypes.NUMBER:
            this.queries.push(`@${searchIndex}:[${value} ${value}]`);
            break;
        }

        return this;
      }
    }
  }

  toString() {
    return this.queries.join('');
  }
}