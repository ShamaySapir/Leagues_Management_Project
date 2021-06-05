var express = require("express");
var router = express.Router();
// const DButils = require("./utils/DButils");
const unionRep_domain = require("./domainLayer/unionRep_domain");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

//check if user is unionRep

// router.use("/addMatch", async function(req, res, next) {
//     try {
//         let user_permission = await DButils.execQuery(`SELECT userId FROM unionRep WHERE userId =${req.session.user_id}`)
//         if (user_permission[0].permission == 1) next()
//         else { res.sendStatus(403) }
//     } catch (error) { next(error) }
// });


router.post("/CreateMatches", async(req, res, next) => {
    const leagues = await axios.get(`${api_domain}/leagues`, {
        params: {
            // include: "squad",
            api_token: process.env.api_token,
        },
    });

    const seasons = await axios.get(`${api_domain}/seasons`, {
        params: {
            api_token: process.env.api_token,
        },
    });

    if (!leagues.data.data.contains(req.body.leagueId) || Object.size(leagues) == 0) {
        res.status(404).send("league not found")
    }

    if (!seasons.data.data.contains(req.body.seasonId) || !seasons.data.data.leagueId == req.body.leagueId || Object.size(leagues) == 0) {
        res.status(404).send("season not found")
    }

    if (req.body.policy == 'undefined') {
        req.body.policy == 1;
    }

    if (req.body.policy == 1) {

        try {
            firstPolicy = await unionRep_domain.();
            res.send();

        } catch (error) {
            next(error);
        }
    } else if (req.body.policy == 2) {
        try {
            secondPolicy = await unionRep_domain.();
            res.send();

        } catch (error) {
            next(error);
        }

    } else {
        res.status(400).send("Wrong input parameters")
    }

});
module.exports = router;