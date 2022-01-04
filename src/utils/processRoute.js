export const processRoute = (req, res, globalVariables) => {
  // console.log(req.url, req.headers);
  const host = globalVariables.hosts.getHostByName(req.headers.host);

  if (!host) {
    res.statusCode = 404;
    res.end('Can\'t find hostname');
    return;
  }

  console.log(host);
  res.statusCode = 200;
  res.end('OK');
}
