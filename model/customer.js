const mongoose = require("mongoose");

const cusomterSchema = new mongoose.Schema({
  name: { type: String, default: null },
  address: { type: String, default: null },
  city: { type: String},
  phone_no: {type: String, unique: true},
  enquery_ids: [],
  service_ids : []
});

module.exports = mongoose.model("customer", cusomterSchema);