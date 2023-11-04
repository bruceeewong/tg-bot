const env = require('../env');

const authTokenValidator = (req, res, next) => {
  const authToken = req.query.token;
  if (!authToken || authToken !== env.TG_AUTH_TOKEN) {
      return res.status(401).send('Unauthorized');
  }
  next();
}

module.exports = authTokenValidator