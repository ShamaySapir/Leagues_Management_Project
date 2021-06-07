var express = require("express");
var router = express.Router();
const referees_domain = require("../../domainLayer/referees_domain");

router.post("/createRefree", async (req, res, next) => 
{
    try
    {
        let userInfo = await referees_domain.CreateRefree(req);
    }
    catch(error)
    {
        if(error.message == "User exist already")
        {
            res.status(404).send(error.message);
        }
        else
        {
            res.status(500).send("an a error in server DB");
        }
    }



}
);
module.exports = router;