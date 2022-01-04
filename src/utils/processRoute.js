export const processRoute = (req, res, globalVariables) => {
  console.log(req.url, req.headers);
  res.statusCode = 200;
  res.end('OK');
}
