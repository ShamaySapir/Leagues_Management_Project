var express = require("express");
var router = express.Router();
const referees_domain = require("../../domainLayer/referees_domain");

router.post("/createReferee", async (req, res, next) => {
  try {
    let userInfo = await referees_domain.CreateReferee(req);
    if (userInfo) {
      res.status(200).send("Referee added successfully");
    }
  } catch (error) {
    if (error.error.message == "User already exist") {
      res.status(404).send(error.message);
    } else if (error.error.message == "Referee already exist") {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("error in server DB");
    }
  }
});

router.get("", async (req, res, next) => {
  try {
    let referees = await referees_domain.getReferees();
    if (referees) {
      res.status(200).send(referees);
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
