var express = require("express");
var router = express.Router();
const path = require("path");
const auth_utils = require("../dataLayer/utils/auth_utils");
const bcrypt = require("bcryptjs");
const { nextTick } = require("process");

async function login(username, password) {
  //check if login is post request or get
  try {
    let userInfo = await auth_utils.getUserInfo(username);
    let user_password = userInfo.password;

    // check that username exists & the password is correct

    if (!userInfo || password != user_password) {
      // throw { status: 401, message: "Username or Password incorrect" };
      return false;
    }
    return userInfo.userId;
  } catch (error) {
    return false;
  }
}

async function userRegister(user) {
  try {
    let user_info = await auth_utils.getUserInfo(user.username);

    // check if user is in the system already and ask bar if a user name is uniq or not
    if (Object.size(user_info) == 0) {
      user = await auth_utils.insertUserInfo(user);
    } else {
      throw { message: "User already exist" };
    }
    return user;
  } catch (error) {
    console.error(error);
    throw { error: error };
  }
}
async function getUsers() {
  users = await auth_utils.getUsers();
  return users;
}

exports.getUsers = getUsers;

exports.login = login;
exports.userRegister = userRegister;