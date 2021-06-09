var express = require("express");
const axios = require("axios");
var router = express.Router();

// const DButils = require("./utils/DButils");

const matches_domain = require("../../domainLayer/matches_domain");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

router.use("/createMatches", async (req, res, next) => {
  try {
    //check if user has FAR access
    const isValid = await matches_domain.UserIsUnionRep(req.session.user_id);
    if (isValid) {
      next();
    } else {
      throw { status: 500, message: "User is not Union representative" };
    }
  } catch (error) {
    next(error);
  }
});

router.get("", async (req, res, next) => {
  try {
    let matches = await matches_domain.getMatches();
    if (matches) {
      res.status(200).send(matches);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/createMatches", async (req, res, next) => {
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

  if (
    !leagues.data.data.some(
      (e) => e.id == req.body.leagueId && Object.size(e) != 0
    )
  ) {
    res.status(404).send("league not found");
  }

  if (
    !seasons.data.data.some(
      (e) => e.id == req.body.seasonId && e.league_id == req.body.leagueId
    ) ||
    Object.size(seasons) == 0
  ) {
    res.status(404).send("league not found");
  }

  if (req.body.policy == "undefined") {
    req.body.policy == 1;
  }

  if (req.body.policy == 1) {
    try {
      let firstPolicy = await matches_domain.scheduleByFirstPolicy(
        req.body.leagueId,
        req.body.seasonId
      );
      res.status(200).send("League matches created successfully");
    } catch (error) {
      next(error);
    }
  } else if (req.body.policy == 2) {
    try {
      secondPolicy = await matches_domain.scheduleBySecondPolicy(
        req.body.leagueId,
        req.body.seasonId
      );
      res.status(200).send(secondPolicy);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).send("Wrong input parameters");
  }
});

module.exports = router;
