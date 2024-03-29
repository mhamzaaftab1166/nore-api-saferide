const express = require("express");
const error = require("../middleware/error");
const users = require("../routes/users");
const auth = require("../routes/auth");

module.exports = function (app) {
  //for express
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
  //to express
};
