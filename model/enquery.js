const mongoose = require("mongoose");
require("./customer");
require("./user");
var Schema = mongoose.Schema;
const enquerySchema = new mongoose.Schema({
  customer_id: { type: Schema.ObjectId, ref: "customer" },
  salesmen_id: { type: Schema.ObjectId, ref: "user" },
  shop_id: Schema.ObjectId,
  status: { type: String },
  date_of_entry: { type: String },
  count: String,
  products: [],
  logs: [],
  remarks: String,
});

module.exports = mongoose.model("enquery", enquerySchema);
