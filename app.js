// require("dotenv").config();
require("rootpath")();
require("./config/database").connect();
const express = require("express");
const auth = require("./middileware/auth");
const cors = require("cors");
var bodyParser = require("body-parser");
const {
  register,
  login,
  refreshToken,
  resetPassword,
  disableProfile,
} = require("./controller/auth.controller");

const { getUsers, editUsers } = require("./controller/user.controller");
const {
  createEnquiries,
  updateEnquries,
  getEnquiries,
  // getExpiredEnquiries,
  getTodaysEnquiries,
  // changeStatus,
  getshops,
  shopCreate,
} = require("./controller/enquery.controller");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.post("/api/register", auth, register);
app.post("/api/login", login);
app.post("/api/resetPassword", auth, resetPassword);
app.get("/api/users/:id", auth, getUsers);
app.get("/api/getShops", auth, getshops);
app.post("/api/createShops", auth, shopCreate);
app.post("/api/disableProfile/:id", auth, disableProfile);
app.post("/api/editUser", auth, editUsers);
app.get("/ping", auth, (req, res, next) => {
  return res.status(200).json({ message: "Ping" });
});

// Enquery api start here
app.post("/api/createEnquery", auth, createEnquiries);
app.put("/api/editEnquery", auth, updateEnquries);
app.get("/api/getEnquiries", auth, getEnquiries);
// app.get("/api/getExpiredEnquiries", auth, getExpiredEnquiries);
app.get("/api/getTodaysEnquiries", auth, getTodaysEnquiries);
app.post("/api/refresh-Token", auth, refreshToken);
app.use((error, req, res, next) => {
  res.status(error.statusCode).json({
    message: error.message,
  });
  return res;
});

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`server running on port ${port}`);
});

module.exports = app;
