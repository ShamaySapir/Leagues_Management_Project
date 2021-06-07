var express = require("express");
var router = express.Router();
const path = require("path");
const bcrypt = require("bcryptjs");
const auth_domain = require("../../domainLayer/auth_domain");

router.post("/Login", async(req, res, next) => {
    //check if login is post request or get
    try {
        let login = await auth_domain.login(req.body.username, req.body.password);
        if (!login) {
            throw { status: 401, message: "Username or Password incorrect" };
        }
        res.status(200).send("Login successfully");
    } catch (error) {
        next(error);
    }
});
module.exports = router;