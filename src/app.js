const express = require("express");
const bodyParser = require("body-parser");
const { authTokenValidator, logRequest } = require("./middlewares");
const routes = require("./routes");

const app = express();
app.use(bodyParser.json());
app.use(authTokenValidator);
app.use(logRequest);
app.use("/", routes);

module.exports = app;
