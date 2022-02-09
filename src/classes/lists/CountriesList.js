import { List } from './List';
import { Country } from '../entities';

export class CountriesList extends List {
  static dbName = 'u15821_geo';
  static dbTable = 'countries';
  static entityName = Country;
}
