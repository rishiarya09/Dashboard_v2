const mongoose = require("mongoose");
require("./shop");
var Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  original_password: { type: String },
  password: { type: String },
  shop_id: { type: Schema.ObjectId, ref: "shop" },
  role: { type: String },
  token: { type: String },
  expiresIn: { type: String },
  phone_no: { type: String },
  address: { type: String },
  city: { type: String },
  status: { type: String },
  phone_no: { type: String },
  city: { type: String },
  address: { type: String },
});

module.exports = mongoose.model("user", userSchema);
