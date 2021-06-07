var express = require("express");
var router = express.Router();
const path = require("path");
const auth_utils = require("../dataLayer/utils/auth_utils");
const bcrypt = require("bcryptjs");


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
        return true;

    } catch (error) {
        return false;
    }
}

exports.login = login;