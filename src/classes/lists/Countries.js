import { Updated } from '../Updated';
import { Country } from '../entities';

export class Countries extends Updated {
  static dbName = 'u15821_geo';
  static dbTable = 'countries';
  static className = Country;
}
