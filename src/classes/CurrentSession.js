export class CurrentSession {
  constructor(req, host, connectionType) {
    const [path, query] = req.url.split('?');
    const defaultLangId = 1;

    this.url = {
      path,
      query: new URLSearchParams(query),
    };

    console.log(this.url);

    this.host = host;
  }

  addRoute(route) {
    this.route = route;
  }

  addCategory(category) {
    this.category = category;
  }
}
