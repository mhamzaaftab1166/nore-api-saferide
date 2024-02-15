const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User, validate } = require("../modules/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
let userData = null;
let verificationCode = 0;
let FPEmail = null;
const sendEmail = require("../utils/sendEmail");

router.post("/code", async (req, res) => {
  try {
    if (req.body.forgotPassword === true && req.body.code) {
      if (verificationCode == req.body.code) {
        verificationCode = 0;
        return res.send({ Verify: "Email has been verified" });
      } else {
        return res.status(400).send("Invalid Verification Code!");
      }
    }

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
    } else return res.status(400).send("Invalid Verification Code!");
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
});

router.put("/updatePass", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = password;
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(200).json({ update: true });
    FPEmail = {};
    console.log("done");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  if (user) return res.status(400).send("Email already registered!");
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

router.post("/forgot", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    verificationCode = Math.floor(100000 + Math.random() * 900000);
    sendEmail(req.body.email, verificationCode);
    res.send({ resend: true });
    FPEmail = { email: req.body.email };
  } else {
    res.status(400).send("Invalid Email!");
  }
});

module.exports = router;
