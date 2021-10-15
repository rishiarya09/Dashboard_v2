const bcrypt = require("bcryptjs");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Shop = require("../model/shop");
const Customer = require("../model/customer");
const Enquery = require("../model/enquery");
const config_json = require("../config.json");
const token = process.env.TOKEN_KEY || config_json.TOKEN;

exports.register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      shop_id,
      role,
      phone_no,
      address,
      city,
      status,
    } = req.body.user;
    if (!email.includes("@") && !email.includes(".") && email.length <= 6) {
      res.status(400).json({ error: "email is required." });
    }
    if (!first_name && first_name.length < 3) {
      res
        .status(400)
        .json({ error: "firstname must be minimumm of 3 letters" });
    }
    if (!last_name && last_name.length < 3) {
      res
        .status(400)
        .json({ error: "last_name must be minimumm of 3 letters" });
    }
    if (!password && password.length < 3) {
      var falg_password = checkPasswordComplexity(password);
      if (!falg_password) {
        res.status(400).json({ error: "Please enter valid password" });
      }
    }
    if (!shop_id) {
      res.status(400).json({ error: "shop id is required" });
    }
    if (!role) {
      res.status(400).json({ error: "role is required" });
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ error: "User already exist. PLease Login" });
    }

    var encryptedPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      original_password: password,
      shop_id: shop_id,
      role: role,
      city: city,
      address: address,
      phone_no: phone_no,
      status: status,
    });

    const token = jwt.sign({ user_id: user._id, email }, token, {
      expiresIn: "20m",
    });
    let final_user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      shop_id: user.shop_id,
      role: user.role,
    };

    return res.status(201).json(final_user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

function checkPasswordComplexity(pwd) {
  var regularExpression = /^[a-zA-Z0-9]+$/;
  var valid = regularExpression.test(test);
  return valid;
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email.includes("@") && !email.includes(".") && email.length <= 6) {
      return res.status(400).json({ error: "email is required." });
    }
    if (!password && password.length < 3) {
      var falg_password = checkPasswordComplexity(password);
      if (!falg_password) {
        return res.status(400).json({ error: "Please enter valid password" });
      }
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id, email }, token, {
        expiresIn: "1200000",
      });
      if (user.status == "disable") {
        const error = new Error(`User has been disabled`);
        error.statusCode = 400;
        throw error;
      }
      delete user.password;
      delete user.original_password;
      user.token = token;
      user.expiresIn = "1200000";
      return res.status(200).json(user);
    }
    return res.status(400).json({ error: "Invalid Credentials" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.disableProfile = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const status = req.body.status_body.status;
    if (status) {
      const updated_status = await User.findOneAndUpdate(
        { _id: user_id },
        { status: status }
      );
      if (!updated_status) {
        const error = new Error(`Error Updating the status`);
        error.statusCode = 400;
        throw error;
      }
      return res
        .status(200)
        .json({ message: "Status Updated succesfully", res: updated_status });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, confirm_password, _id } = req.body.user;
    if (!password && password.length < 3) {
      var falg_password = checkPasswordComplexity(password);
      if (!falg_password) {
        res.status(400).json({ error: "Please enter valid password" });
      }
    }
    if (password === confirm_password) {
      var encryptedPassword = await bcrypt.hash(password, 10);
      const user = await User.findOneAndUpdate(
        { _id: _id },
        { password: encryptedPassword, original_password: password }
      );
      if (!user) {
        const error = new Error(`something wrong`);
        error.statusCode = 400;
        throw error;
      }
      return res.status(200).json({ message: "Password updated" });
    } else {
      const error = new Error(`Password doesn't match`);
      error.statusCode = 400;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.refreshToken = async (req, res, next) => {
  try {
    const user = req.body._id;
    const verify = await User.find({ _id: user });
    const email = verify.email;
    if (verify) {
      const token = jwt.sign({ user_id: user, email }, token, {
        expiresIn: "1200000",
      });
      return res.status(200).json({
        token: token,
        expiresIn: "1200000",
      });
    }
    return res.status(400).json({ error: "Invalid Credentials" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
