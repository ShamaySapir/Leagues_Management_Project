const axios = require("axios");
const { NText } = require("mssql");
const matches_utils = require("../dataLayer/utils/matches_utils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";


//policy == 1 : schedule matches so every two teams in the leage play together once
async function scheduleByFirstPolicy(leagueId, seasonId) {
    let teams = await axios.get(`${api_domain}/teams/season/${seasonId}`, {
        params: {
            include: "league",
            api_token: process.env.api_token,
        },
    });
    teams = getTeamsByLeagueId(teams, leagueId);

    let season = await axios.get(`${api_domain}/seasons/${seasonId}`, {
        params: {
            api_token: process.env.api_token,
        },
    });

    let matches = [];
    //TODO: check how the teams look like 
    let season_name = season.data.data.name;
    let years = season_name.split('/');
    let year = years[0];
    var date = year + "-01-01";
    date = new Date(date).toDateString();

    let match_id = await getcurrentMatchId();

    for (let index = 0; index < Object.size(teams); index++) {
        for (let j = index + 1; j < Object.size(teams); j++) {
            let stage_id = await getStageBySeasonId(seasonId);
            let stadium = await getStadium(teams.data.data[index].id);
            let match = {
                matchId: match_id + 1,
                leagueId: leagueId,
                seasonId: seasonId,
                stageId: stage_id,
                matchDate: date,
                matchHour: "20:00:00",
                homeTeam: teams.data.data[index],
                awayTeam: teams.data.data[j],
                stadium: stadium,
                refereeId: null,
                score: null,
            };

            matches.push(match);
            date = addDays(date, 7);
            match_id++;
        }
    }

    //add matches to DB

    let wrote_to_DB = await writeToDB(matches, 'matches');
    if (!wrote_to_DB) {
        throw { message: "failed to write matches to DB" };
    }

};


async function writeToDB(data, table_name) {
    try {
        if (table_name == 'matches') {
            let add_matches = await matches_utils.addMatchesToDB(data)
            if (!add_matches) {
                throw { message: "cannot write matches to DB" };
            }
        }

    } catch (error) { console.log(error) }


}

async function scheduleBySecondPolicy(leagueId, seasonId) {

}

function getTeamsByLeagueId(teams_info, leagueId) {
    let index = 0;
    teams_info.data.data.map((team_info) => {
        const { league } = team_info;
        const { id } = league.data;

        if (id != leagueId) {
            teams_info.data.data.slice(index);
        }
        index++;
    });
    return teams_info;
}

async function getStageBySeasonId(seasonId) {
    let stage = await axios.get(`${api_domain}/stages/season/${seasonId}`, {
        params: {
            api_token: process.env.api_token,
        },
    });

    let size = stage.data.data.length;
    let index = Math.floor(Math.random() * size);

    let curr_stage = stage.data.data[index].id;
    return curr_stage;

}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    result = result.toDateString();

    return result;
}

async function getStadium(team_id) {

    let team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
            include: "venue",
            api_token: process.env.api_token,
        },
    });

    return team.data.data.venue.data.name;
}


async function getcurrentMatchId() {
    let table_size = matches_utils.getTableSize();
    return table_size;
}

exports.scheduleByFirstPolicy = scheduleByFirstPolicy;
exports.scheduleBySecondPolicy = scheduleBySecondPolicy;