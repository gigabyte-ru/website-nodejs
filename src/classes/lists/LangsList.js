import { List } from './List';
import { Lang } from '../entities';
import { FieldTypes } from '../../constants';

export class LangsList extends List {
  static dbName = 'u15821_global';
  static dbTable = 'langs';
  static entityName = Lang;
}
