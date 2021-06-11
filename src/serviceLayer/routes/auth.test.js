var express = require("express");
var router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const auth_domain = require("../../domainLayer/auth_domain");

router.post("/Login", async (req, res, next) => {
  //check if login is post request or get
  try {
    let userId = await auth_domain.login(req.body.username, req.body.password);
    if (!userId) {
      throw { status: 401, message: "Username or Password incorrect" };
    }
    // Set cookie
    req.session.user_id = userId;
    res.status(200).send("Login successfully");
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  if (!req.session.user_id) {
    res.status(404).send("Need to login first");
    return;
  }
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.status(200).send("Logout Successfully");
});

router.get("/getUsers", async (req, res, next) => {
  try {
    let users = await auth_domain.getUsers();
    if (users) {
      res.status(200).send(users);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
