const DButils = require("../utils/DButils");

// TODO: add try catch, change to const
async function getMatches() {
  let matches = await DButils.execQuery(`select * from dbo.matches`);

  return matches;
}
// TODO: Don't forget to write await before every DB interaction! The tests FAILED because of that
async function UpdateRefereeToMatch(matchId, refereeId) {
  try {
    await DButils.execQuery(
      `UPDATE dbo.matches SET refereeId = ${refereeId} WHERE matchId = ${matchId};`
    );
    return true;
  } catch (err) {
    return false;
  }
}

exports.getMatches = getMatches;
exports.UpdateRefereeToMatch = UpdateRefereeToMatch;
