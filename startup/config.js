const config = require("config");

module.exports = function () {
  if (!config.get("jwtpk")) {
    throw new Error("fatal error: jwtpk is not defined.");
  }
};
