const axios = require("axios");
const DButils = require("../utils/DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";


async function getMatches() {
    let matches = await DButils.execQuery(
        `select * from dbo.matches`
    );

    return matches;
}

async function addMatchesToDB(matches) {
    try {
        for (index = 0; index < matches.length; index++) {
            let match = matches[index];

            DButils.execQuery(
                `INSERT INTO dbo.matches (leagueId, seasonId, stageId, matchDate, matchHour , homeTeam , awayTeam , stadium , refereeId, score) VALUES ('${match.leagueId}', '${match.seasonId}', ${match.stageId}, '${match.matchDate}', '${match.matchHour}', '${match.homeTeam}', '${match.awayTeam}','${match.stadium}', ${match.refereeId},${match.score});`
            )
        }

    } catch (err) {
        return false;
    }
    return true;
}

async function UpdateRefereeToMatch(matchId, refereeId) {
    try {

        DButils.execQuery(
            `UPDATE dbo.matches SET refereeId = ${refereeId} WHERE matchId = ${matchId};`
        )
        return true;

    } catch (err) {
        return false;
    }
}


exports.getMatches = getMatches;
exports.addMatchesToDB = addMatchesToDB;
exports.UpdateRefereeToMatch = UpdateRefereeToMatch;