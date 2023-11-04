const logger = require("../logger");

const logRequest = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  logger.info(`Request from IP: ${ip}: [${req.method}] ${req.path}`);

  next();
};

module.exports = logRequest;
