const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 150,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email, role: this.role },
    config.get("jwtpk")
  );
  return token;
};
const User = mongoose.model("User", userSchema);
function validateGenre(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(150).required().email(),
    role: Joi.string().required(),
    password: Joi.string().min(5).max(1150).required(),
  };

  return Joi.validate(user, schema);
}

exports.genreSchema = userSchema;
exports.validate = validateGenre;
exports.User = User;
