import { Updated } from '../Updated';
import { Lang } from '../entities';
import { SchemaFieldTypes } from 'redis';

export class Langs extends Updated {
  static dbName = 'u15821_global';
  static dbTable = 'langs';
  static className = Lang;
  static redisSearchIndexes = {
    '$.alias': {
      type: SchemaFieldTypes.TEXT,
      AS: 'alias',
    },
  };
}
