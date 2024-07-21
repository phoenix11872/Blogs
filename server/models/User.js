const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // username: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // password: {
  //   type: String,
  //   required: true,
  // },
  googleID: String,
  name: String,
});
module.exports = mongoose.model("User", UserSchema);
//nothing new
