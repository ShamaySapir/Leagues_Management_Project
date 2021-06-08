const axios = require("axios");
const DButils = require("../utils/DButils");
const auth_utils = require("../utils/auth_utils");


async function insertRefereeInfo(user) {
    try {
        let user_id = await auth_utils.getUserId(user);

        let query = `INSERT INTO dbo.Referees (userId,username) VALUES (${user_id.userId}, '${user.username}');`;
        DButils.execQuery(
            `INSERT INTO dbo.Referees (userId,username) VALUES (${user_id.userId}, '${user.username}');`
        )

        return true;

    } catch (error) {
        console.log(error);
    }

}

async function getRefereeID(username) {
    let Referee = await DButils.execQuery(
        `select refereeId from dbo.Referees WHERE username = ${username};`
    );

    return Referee[0]["refereeId"];
}

exports.insertRefereeInfo = insertRefereeInfo;
exports.getRefereeID = getRefereeID;