const mongoose = require("mongoose");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.CONNECTION);
  console.log("data base connected");
}
module.exports = main;
