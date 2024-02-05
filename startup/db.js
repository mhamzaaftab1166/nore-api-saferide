const mongoose = require("mongoose");
const config = require("config");
const options = {
  family: 4, // Use IPv4, skip trying IPv6
};

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, options)
    .then(() => console.log(`connected to ${db}...`))
    .catch((e) => console.log("could not cnnt to db", err.message));
};
