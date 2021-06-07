const axios = require("axios");
const DButils = require("../utils/DButils");


async function getUserInfo(username) {
    try {
        const user = (
            await DButils.execQuery(
                `SELECT * FROM dbo.users WHERE username = '${username}'`
            )
        )[0];

        return user;
    } catch (error) {
        next(error);
    }

}

exports.getUserInfo = getUserInfo;