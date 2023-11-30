const { requestFail } = require("../helpers/RequestResponse.helper");
const proxyUrls = require("../configs/BasicAuthProxyUrl.config") || [];

function BasicAuth(req, res, next) {
  if (proxyUrls.includes(`${req.originalUrl}`) != -1) return next();

  try {
    let token = req.headers["authorization"];

    if (!token) return requestFail(res);

    let user = verifyJWT(token);

    if (user) next();

    requestFail(res);
  } catch (error) {}

  
  requestFail(res);
}

module.exports = { BasicAuth };
