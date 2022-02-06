import { Updated } from '../Updated';
import { Article } from '../entities';
import { SchemaFieldTypes } from 'redis';

export class Articles extends Updated {
  static dbName = 'u15821_global';
  static dbTable = 'articles';
  static className = Article;
  static redisSearchIndexes = {
    '$.langId': {
      AS: 'lang_id',
      type: SchemaFieldTypes.NUMERIC,
    },
    '$.articleId': {
      AS: 'article_id',
      type: SchemaFieldTypes.NUMERIC,
    },
    '$.alias': {
      AS: 'alias',
      type: SchemaFieldTypes.TEXT,
    },
  };
}
