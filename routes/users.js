const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User, validate } = require("../modules/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
let userData = null;
let verificationCode = 0;
const sendEmail = require("../utils/sendEmail");

router.post("/code", async (req, res) => {
  try {
    // if (req.body.forgetpassword && req.body.code) {
    //   // Handle forget password logic here
    // }
    console.log(req.body);
    if (verificationCode == req.body.code) {
      verificationCode = 0;
      const user = new User(
        _.pick(userData, ["name", "email", "role", "password"])
      );
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      const token = user.generateAuthToken();
      return res
        .header("access-control-expose-headers", "x-auth-token")
        .header("x-auth-token", token)
        .send(_.pick(user, ["_id", "name", "email"]));
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/resend", async (req, res) => {
  console.log(7);
  verificationCode = Math.floor(100000 + Math.random() * 900000);
  sendEmail(userData.email, verificationCode);
  res.send({ resend: true });
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered.");
  userData = req.body;
  console.log(userData);
  verificationCode = Math.floor(100000 + Math.random() * 900000);
  sendEmail(userData.email, verificationCode);
  res.send({
    success: true,
    message: "Email Send succefuly",
    email: userData.email,
  });
});

module.exports = router;
