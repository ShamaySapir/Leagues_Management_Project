const axios = require("axios");
const DButils = require("../utils/DButils");

async function insertRefereeInfo(user) {
    try {

        DButils.execQuery(
            `INSERT INTO dbo.Referees (userId,username) VALUES ('${user.id}', '${user.name}');`
        )
        
        return true;

    } catch (error) {
       return false;
    }

}

exports.insertRefereeInfo = insertRefereeInfo;