const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const port = process.env.PORT || 3500;
let server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);
module.exports = server;
