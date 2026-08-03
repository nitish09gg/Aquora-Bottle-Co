const mongoose = require("mongoose");
const userSchema = require("../schemas/UserSchema");

const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

module.exports = UserModel;