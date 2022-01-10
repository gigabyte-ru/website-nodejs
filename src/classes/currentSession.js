import { globalVariables } from './globalVariables.js';

class CurrentSession {
  init(host, connectionType) {
    const defaultLangId = 1;
    this.connectionType = connectionType;
    this.host = host;

    this.translations = {
      first: globalVariables.translations.get(
        host.firstLangId ?? defaultLangId
      ),
      second: globalVariables.translations.get(
        host.secondLangId ?? defaultLangId
      ),
      default: globalVariables.translations.get(
        host.defaultLangId ?? defaultLangId
      ),
    };
    this.country = globalVariables.countries.get(this.host.countryId);
  }
}

export const currentSession = new CurrentSession();
