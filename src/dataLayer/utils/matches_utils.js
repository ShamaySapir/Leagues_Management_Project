const axios = require("axios");
const { execQuery } = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";


async function getTableSize() {
    let matches = await DButils.execQuery(
        `select * from dbo.Matches'`
    );

    let table_size = Object.size(matches);

    return table_size;
}



exports.getTableSize = getTableSize;