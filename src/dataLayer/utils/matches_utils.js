const axios = require("axios");
const DButils = require("../utils/DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";


async function getTableSize() {
    let matches = await DButils.execQuery(
        `select * from dbo.matches`
    );

    let table_size = Object.size(matches);

    return table_size;
}

async function addMatchesToDB(data) {
    //TODO: implement the function
    if (!data) {
        throw { status: 404, message: "problem" };
    }
}


exports.getTableSize = getTableSize;
exports.addMatchesToDB = addMatchesToDB;