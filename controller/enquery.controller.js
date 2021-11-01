const bcrypt = require("bcryptjs");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Shop = require("../model/shop");
const Customer = require("../model/customer");
const Enquery = require("../model/enquery");
const { json, query } = require("express");

exports.createEnquiries = async (req, res, next) => {
  try {
    const req_body = req.body;
    const { status, products, date_of_entry, salesman_id, shop_id } = req_body;
    const { name, phone_no, address, city } = req_body.customer_id;
    // find if the customer exists
    var find_customer = await Customer.findOne({ phone_no });
    var customer;
    if (!find_customer) {
      customer = await Customer.create({
        name: name,
        phone_no: phone_no,
        address: address,
        city: city,
      });
    }
    cus_id = !find_customer ? customer._id : find_customer._id;
    var new_enquery = await Enquery.create({
      customer_id: cus_id,
      salesmen_id: salesman_id,
      shop_id: shop_id,
      products: products,
      date_of_entry: date_of_entry,
      status: status,
    });
    new_query_id = new_enquery._id;
    enq_id_arr = find_customer ? find_customer.enquery_ids : [];
    enq_id_arr.push(new_query_id);
    var updated_enquery;
    if (new_enquery) {
      updated_enquery = await Customer.findByIdAndUpdate(
        { _id: cus_id },
        { enquery_ids: enq_id_arr },
        { new: true }
      );
      if (!updated_enquery) {
        const error = new Error(`Enquery not created`);
        error.statusCode = 400;
        throw error;
      }
      return res
        .status(200)
        .json({ message: "Enquery creted", res: updated_enquery });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateEnquries = async (req, res, next) => {
  try {
    const req_body = req.body;
    const { _id, status, products, logs, salesmen_id, remarks } = req_body;
    const { name, phone_no, address, city } = req_body.customer_id;
    const cust_id = req_body.customer_id;
    let query_role = await User.find({
      _id: salesmen_id,
    });

    let customer = await Customer.findOneAndUpdate(
      { phone_no: phone_no },
      {
        name: name,
        phone_no: phone_no,
        address: address,
        city: city,
      },
      { new: true }
    );
    if (!customer) {
      const error = new Error(`Error in editing cutomer`);
      error.statusCode = 400;
      throw error;
    }
    let edit_enquery;
    if (query_role[0].role === "m") {
      var new_log = logs.length != 0 ? logs : [];
      // new_log.push(log);
      edit_enquery = await Enquery.findOneAndUpdate(
        { _id: _id },
        {
          logs: new_log,
          products: products,
          status: status,
          remarks: remarks,
        },
        { new: true }
      );
    } else if (query_role[0].role === "s") {
      edit_enquery = await Enquery.findOneAndUpdate(
        { _id: _id },
        {
          products: products,
          status: status,
          remarks: remarks,
        },
        { new: true }
      );
    }
    if (!edit_enquery) {
      const error = new Error(`Enquery couldn't be edited`);
      error.statusCode = 400;
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Enquery edited successfully", res: edit_enquery });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTodaysEnquiries = async (req, res, next) => {
  try {
    var salesmen_id = req.query.salesmen_id;
    var date = req.query.date;
    if (salesmen_id && date) {
      let salesmen_exists = await User.find({
        _id: salesmen_id,
      });
      if (salesmen_exists && salesmen_exists[0].role === "s") {
        var enqueries = await Enquery.find({
          salesmen_id: salesmen_id,
          date_of_entry: date,
        }).populate(["customer_id", "salesmen_id"]);
        if (!enqueries) {
          const error = new Error(`Something wrong`);
          error.statusCode = 400;
          throw error;
        }
        return res.status(200).json(enqueries);
      }

      if (salesmen_exists && salesmen_exists.role === "m") {
        var enqueries = await Enquery.find({
          shop_id: salesmen_exists.shop_id,
          date_of_entry: date,
        }).populate(["customer_id", "salesmen_id"]);
        if (!enqueries) {
          const error = new Error(`Something wrong`);
          error.statusCode = 400;
          throw error;
        }
        return res.status(200).json(enqueries);
      }

      if (salesmen_exists && salesmen_exists.role === "a") {
        var enqueries = await Enquery.find({
          date_of_entry: date,
        }).populate(["customer_id", "salesmen_id"]);
        if (!enqueries) {
          const error = new Error(`Something wrong`);
          error.statusCode = 400;
          throw error;
        }
        return res.status(200).json(enqueries);
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
// exports.getExpiredEnquiries = asyn (req, res, next) => {
//   try{

//   } catch {

//   }
// }

exports.getEnquiries = async (req, res, next) => {
  try {
    var salesmen_id = req.query.salesmen_id;
    var date = req.query.date;
    let role = await User.find({
      _id: salesmen_id,
    });
    let shop_id = role[0].shop_id;
    if (role[0].role === "m") {
      var enqueries = await Enquery.find({
        shop_id: shop_id,
      }).populate(["customer_id", "salesmen_id"]);
      return res.json(enqueries);
    } else if (role[0].role === "a") {
      var enqueries = await Enquery.find().populate([
        "customer_id",
        "salesmen_id",
      ]);

      return res.json(enqueries);
    } else {
      var enqueries = await Enquery.find({
        salesmen_id: salesmen_id,
        "products.date": date,
      }).populate(["customer_id", "salesmen_id"]);
      return res.status(200).json(enqueries);
    }
  } catch (err) {
    if (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        console.log(err);
      }
      next(err);
    }
  }
};
async function getCustomerDetails(doc) {
  let full_enquery = {};
  let customer_details = await Customer.find({ _id: doc.customer_id }).then(
    (x) => {
      return x;
    }
  );
  full_enquery = { ...customer_details["0"]._doc, ...doc._doc };
  return full_enquery;
}

// exports.changeStatus = async (req, res, next) => {
//   try {
//     const enq_id = req.params.id;

//   } catch (err) {}
// };

exports.shopCreate = async (req, res, next) => {
  try {
    const { shop_name, shop_city, shop_address, shop_phone_number } = req.body;
    let shop = await Shop.create({
      shop_name: shop_name,
      shop_city: shop_city,
      shop_address: shop_address,
      shop_phone_number: shop_phone_number,
    });
    if (!shop) {
      const error = new Error(`Something wrong`);
      error.statusCode = 400;
      throw error;
    }
    return res.status(200).json({ message: "SHop created successfully" });
  } catch (err) {
    if (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        console.log(err);
      }
      next(err);
    }
  }
};

exports.getshops = async (req, res, next) => {
  try {
    let shops = await Shop.find({});
    if (!shops) {
      const error = new Error(`Something wrong`);
      error.statusCode = 400;
      throw error;
    }
    return res.status(200).json(shops);
  } catch (err) {
    if (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        console.log(err);
      }
      next(err);
    }
  }
};
