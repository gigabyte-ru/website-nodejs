import { FieldTypes } from '../constants/fieldTypes';
import { SchemaFieldTypes } from 'redis';

const redisTypesMapper = {
  [FieldTypes.STRING]: SchemaFieldTypes.TEXT,
  [FieldTypes.NUMBER]: SchemaFieldTypes.NUMERIC,
};

/**
 * @param { Object.<string, SearchIndex> } searchIndexObject
 * @return { Object.<string, RedisIndexObject> }
 */
export const redisIndexesMapper = (searchIndexObject) => {
  return Object.keys(searchIndexObject).reduce(
    (acc, key) => ({
      ...acc,
      [`$.${key}`]: {
        type: redisTypesMapper[searchIndexObject[key].type],
        AS: key,
      },
    }),
    {}
  );
};
