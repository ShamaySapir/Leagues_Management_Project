const axios = require("axios");
const DButils = require("../utils/DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getMatches() {
  let matches = await DButils.execQuery(`select * from dbo.matches`);

  return matches;
}

async function UpdateRefereeToMatch(matchId, refereeId) {
  try {
    DButils.execQuery(
      `UPDATE dbo.matches SET refereeId = ${refereeId} WHERE matchId = ${matchId};`
    );
  } catch (err) {
    return false;
  }
  return true;
}

async function UpdateRefereeToMatch(matchId, refereeId) {
  try {
    DButils.execQuery(
      `UPDATE dbo.matches SET refereeId = ${refereeId} WHERE matchId = ${matchId};`
    );
    return true;
  } catch (err) {
    return false;
  }
}

exports.getMatches = getMatches;
// exports.addMatchesToDB = addMatchesToDB;
exports.UpdateRefereeToMatch = UpdateRefereeToMatch;
