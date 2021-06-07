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

async function addMatchesToDB(matches) {
    //TODO: implement the function
    try
    {
        for (index = 0; index < matches.length; index++) 
        {
            let match = matches[index];

            DButils.execQuery
            (
                `INSERT INTO dbo.matches (leagueId, seasonId, stageId, matchDate, matchHour , homeTeam , awayTeam , stadium , refereeId, score) VALUES ('${match.leagueId}', '${match.seasonId}', ${match.stageId}, '${match.matchDate}', '${match.matchHour}', '${match.homeTeam}', '${match.awayTeam}','${match.stadium}', ${match.refereeId},${match.score});`
            )
        }

    }
    catch(err)
    {
        return false;
    }
    return true;
}


exports.getTableSize = getTableSize;
exports.addMatchesToDB = addMatchesToDB;