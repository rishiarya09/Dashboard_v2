const User = require("../model/user");
const Shop = require("../model/shop");
const Customer = require("../model/customer");
const Enquery = require("../model/enquery");

exports.getUsers = async (req, res, next) => {
  try {
    const salesman_id = req.params.id;
    let role = await User.find({
      _id: salesman_id,
    });
    let got_shop_id = role[0].shop_id;
    if (role[0].role == "m") {
      const users = await User.find({
        shop_id: got_shop_id,
      });
      if (!users) {
        const error = new Error(`Something wrong`);
        error.statusCode = 400;
        throw error;
      }
      return res.status(200).json(users);
    } else if (role[0].role == "a") {
      const users = await User.find({});
      if (!users) {
        const error = new Error(`Something wrong`);
        error.statusCode = 400;
        throw error;
      }
      return res.status(200).json(users);
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

exports.editUsers = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone_no, address, city, _id } =
      req.body.user;
    const user = await User.findOneAndUpdate(
      { _id: _id },
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_no: phone_no,
        address: address,
        city: city,
      }
    );
    if (!user) {
      const error = new Error(`Something wrong updating`);
      error.statusCode = 400;
      throw error;
    }
    return res.status(200).json({ message: "User updated succesfully" });
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
