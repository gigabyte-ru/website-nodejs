export class CurrentSession {
  constructor(globalVariables, host) {
    this.globalVariables = globalVariables;
    const defaultLangAlias = 'en';
    this.host = host;

    this.firstLangAlias = host.firstLangId
      ? globalVariables.langs.get(host.firstLangId)?.alias
      : defaultLangAlias;
    this.secondLangAlias = host.secondLangId
      ? globalVariables.langs.get(host.secondLangId)?.alias
      : defaultLangAlias;
    this.thirdLangAlias = host.defaultLangId
      ? globalVariables.langs.get(host.defaultLangId)?.alias
      : defaultLangAlias;

    this.translations = {
      first: globalVariables.translations.get(this.firstLangAlias),
      second: globalVariables.translations.get(this.secondLangAlias),
      default: globalVariables.translations.get(this.thirdLangAlias),
    };
    this.country = globalVariables.countries.get(this.host.countryId);
  }
}
