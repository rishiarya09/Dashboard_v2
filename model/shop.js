const mongoose = require("mongoose");

var Schema = mongoose.Schema;
const shopSchema = new mongoose.Schema({
  shop_name: { type: String, default: null },
  shop_city: { type: String, default: null },
  shop_address: { type: String },
  shop_phone_number: { type: String },
  shop_id: { type: Schema.ObjectId },
});

module.exports = mongoose.model("shop", shopSchema);
