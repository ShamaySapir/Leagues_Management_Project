const axios = require("axios");
const DButils = require("../utils/DButils");
const auth_utils = require("../utils/auth_utils");

async function insertRefereeInfo(id, username) {
    try {
        DButils.execQuery(
            `INSERT INTO dbo.Referees (userId, username) VALUES (${id}, '${username}');`
        );
        return true;
    } catch (error) {
        console.error(error);
    }
}

async function getRefereeID(username) {
    let Referee = await DButils.execQuery(
        `SELECT * from dbo.Referees WHERE username = '${username}';`
    );

    return Referee[0]["refereeId"];
}

exports.insertRefereeInfo = insertRefereeInfo;
exports.getRefereeID = getRefereeID;