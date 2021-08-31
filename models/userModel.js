const mongoose = require("mongoose");

const UserModel = mongoose.model(
  "User",
  mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
  })
);
module.exports = {
  UserModel,
};