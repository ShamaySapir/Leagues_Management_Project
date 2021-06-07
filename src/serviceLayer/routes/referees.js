var express = require("express");
var router = express.Router();
const referees_domain = require("../../domainLayer/referees_domain");

router.post("/createReferee", async(req, res, next) => {
    try {
        let userInfo = await referees_domain.CreateReferee(req);
    } catch (error) {
        if (error.message == "User already exist") {
            res.status(404).send(error.message);
        } else {
            res.status(500).send("an a error in server DB");
        }
    }



});
module.exports = router;