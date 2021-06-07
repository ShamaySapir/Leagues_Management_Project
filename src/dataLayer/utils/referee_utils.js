const axios = require("axios");
const DButils = require("../utils/DButils");
const auth_utils = require("../utils/auth_utils");


async function insertRefereeInfo(user) {
    try {
        let user_id = await auth_utils.getUserId(user);

        DButils.execQuery(
            `INSERT INTO dbo.Referees (userId,username) VALUES ('${user_id.userId}', '${user.username}');`
        )

        return true;

    } catch (error) {
        console.log(error);
    }

}

exports.insertRefereeInfo = insertRefereeInfo;