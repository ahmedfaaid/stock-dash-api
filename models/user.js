const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"]
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"]
  },
  email: {
    type: String,
    required: [true, "Please enter an email address"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"]
  },
  stocks: {
    type: [String],
    required: false
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
