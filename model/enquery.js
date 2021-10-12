const mongoose = require("mongoose");
require("./customer");
var Schema = mongoose.Schema;
const enquerySchema = new mongoose.Schema({
  customer_id: { type: Schema.ObjectId, ref: "customer" },
  salesmen_id: Schema.ObjectId,
  shop_id: Schema.ObjectId,
  status: { type: String },
  date_of_entry: { type: String },
  count: String,
  products: [],
  logs: [],
});

module.exports = mongoose.model("enquery", enquerySchema);
