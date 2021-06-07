var express = require("express");
var router = express.Router();
const path = require("path");
const DButils = require("../../dataLayer/utils/DButils");
const bcrypt = require("bcryptjs");

router.post("/Login", async(req, res, next) => {
    //check if login is post request or get
    try {
        const user = (
            await DButils.execQuery(
                `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
            )
        )[0];

        const password = (
            await DButils.execQuery(
                `SELECT password FROM dbo.users WHERE username = '${req.body.username}'`
            )
        )[0];
        // check that username exists & the password is correct
        if (!user || !password || password.password != req.body.password) {
            throw { status: 401, message: "Username or Password incorrect" };
        }
        // Set cookie
        req.session.user_id = user.userId;
        // return cookie
        res.status(200).send("Login successfully");
    } catch (error) {
        next(error);
    }
});
module.exports = router;