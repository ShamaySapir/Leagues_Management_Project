const DButils = require("../utils/DButils");

// TODO add should be const
async function insertRefereeInfo(id, username) {
  try {
    let add = await DButils.execQuery(
      `INSERT INTO dbo.Referees (userId, username) VALUES (${id}, '${username}');`
    );
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// TODO Referee should be const, no try catch? if Referee is null there is not .length => Error
async function getRefereeID(username) {
  let Referee = await DButils.execQuery(
    `SELECT * from dbo.Referees WHERE username = '${username}';`
  );
  if (Referee.length === 0) {
    return -1;
  }

  return Referee[0].refereeId;
}

// TODO: add try catch, change to const
async function getReferees() {
  let Referees = await DButils.execQuery(
    `SELECT [refereeId], [userId], [username] from dbo.Referees;`
  );
  return Referees;
}

exports.insertRefereeInfo = insertRefereeInfo;
exports.getRefereeID = getRefereeID;
exports.getReferees = getReferees;
