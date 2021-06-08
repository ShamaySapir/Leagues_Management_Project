const axios = require("axios");

const referee_utils = require("../dataLayer/utils/referee_utils");
const auth_domain = require("../domainLayer/auth_domain");
const matches_utils = require("../dataLayer/utils/matches_utils");
const DButils = require("../dataLayer/utils/DButils.js");
const auth_utils = require("../dataLayer/utils/auth_utils");

async function CreateRefree(req) {
  let userName = req.body.userName;
  let userFirstName = req.body.userFirstName;
  let userLastName = req.body.userLastName;
  let country = req.body.country;
  let password = req.body.password;
  let email = req.body.email;
  let image;

  let user = {
    username: userName,
    firstName: userFirstName,
    lastName: userLastName,
    country: country,
    password: password,
    email: email,
  };

  if (req.body.image) {
    image = req.body.image;
    user.image = image;
  }

  try {
    user = await auth_domain.userRegister(user);
  } catch (error) {
    throw { error: error };
  }

  try {
    await insertToRefreeTable(user);
    let refereeId = await referee_utils.getRefereeID(user.username);
    await assignRefereeToMatch(refereeId);
  } catch (error) {
    throw { error: error };
  }
}

async function insertToRefreeTable(user) {
  const userId = await auth_utils.getUserId(user);
  await referee_utils.insertRefereeInfo(userId, user.username);
}

async function assignRefereeToMatch(refereeId, matchId) {
  let matches = await matches_utils.getMatches();
  console.log(matches);
  //   if( matches.includes("Mango");) {}
  let matchesLength = await DButils.getTableSize("matches");

  // in case the referee is less then then the games
  if (refereeId <= matchesLength) {
    matches_utils.UpdateRefereeToMatch(refereeId, refereeId);
  } else {
    let matchId = Math.floor(Math.random() * matchesLength) + 1;
    matches_utils.UpdateRefereeToMatch(matchId, refereeId);
  }
}

exports.CreateRefree = CreateRefree;
