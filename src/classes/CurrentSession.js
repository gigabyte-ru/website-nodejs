import { globalVariables } from './GlobalVariables';

export class CurrentSession {
  constructor(req, host, connectionType) {
    const [path, query] = req.url.split('?');
    const defaultLangId = 1;

    this.url = {
      path,
      query: new URLSearchParams(query),
    };

    console.log(this.url);

    this.connectionType = connectionType;
    this.host = host;

    this.translations = {
      first: globalVariables.variables.translations.get(
        host.firstLangId ?? defaultLangId
      ),
      second: globalVariables.variables.translations.get(
        host.secondLangId ?? defaultLangId
      ),
      default: globalVariables.variables.translations.get(
        host.defaultLangId ?? defaultLangId
      ),
    };
    this.country = globalVariables.variables.countries.get(this.host.countryId);
  }

  addRoute(route) {
    this.route = route;
  }

  addCategory(category) {
    this.category = category;
  }
}
