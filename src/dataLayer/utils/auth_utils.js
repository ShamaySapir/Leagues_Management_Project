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

        let info = DButils.execQuery(
            `INSERT INTO dbo.Users (username, firstname, lastname, country, password , email , image) VALUES ('${user.username}','${user.firstName}', '${user.lastName}', '${user.country}', '${user.password}', '${user.email}', '${user.image}');`
        )
        
        return true;

    } catch (error) {
       return false;
    }

}


exports.getUserInfo = getUserInfo;
exports.insertUserInfo = insertUserInfo;