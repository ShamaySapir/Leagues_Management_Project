const axios = require("axios");
const DButils = require("../utils/DButils");


async function getUserInfo(username) {
    try {
        const user = (
            await DButils.execQuery(
                `SELECT * FROM dbo.Users WHERE username = '${username}'`
            )
        )[0];

        return user;
    } catch (error) {
        next(error);
    }

}


async function insertUserInfo(user) {
    try {
        if (!user.image) {
            user.image = null;
        }

        DButils.execQuery(
            `INSERT INTO dbo.Users (username, firstname, lastname, country, password , email , image) VALUES ('${user.username}','${user.firstName}', '${user.lastName}', '${user.country}', '${user.password}', '${user.email}', '${user.image}');`
        )
        return user;

    } catch (error) {
        console.log(error);
    }

}

async function getUserId(user) {
    try {
        const user_id = (
            await DButils.execQuery(
                `SELECT userId FROM dbo.Users WHERE username = '${user.username}'`
            )
        )[0];
        return user_id;

    } catch (error) {
        console.log(error);
    }
}


exports.getUserInfo = getUserInfo;
exports.insertUserInfo = insertUserInfo;
exports.getUserId = getUserId;