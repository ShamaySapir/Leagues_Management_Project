const axios = require("axios");
const path = require('path');
const matches_utils = require(path.join(process.cwd(), "./src/dataLayer/utils/matches_utils"));


//policy == 1 : schedule matches so every two teams in the leage play together once
async function scheduleByFirstPolicy(leagueId, seasonId) {
    let teams = await axios.get(`${api_domain}/teams/seasons/${seasonId}`, {
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
    let year = season_name.split('/');
    var date = year + "-01-01";

    for (let index = 0; index < Object.size(teams); index++) {
        for (let j = index + 1; j < Object.size(teams); j++) {
            let match = {
                matchId: getcurrentMatchId(),
                leagueId: leagueId,
                seasonId: seasonId,
                stageId: getStageBySeasonId(seasonId),
                matchDate: date,
                matchHour: "20:00:00",
                homeTeam: teams.data.data[index],
                awayTeam: teams.data.data[j],
                stadium: getStadium(homeTeam),
                refereeId: null,
                score: null,
            };

            matches.push(match);
            date = addDays(date, 7);
        }
    }

    //TODO: add matches to DB

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

    return stage.data.data[index].id;

}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

async function getStadium(team_id) {

    let team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
            include: "venue",
            api_token: process.env.api_token,
        },
    });

    return team.data.data.venue.name;
}


async function getcurrentMatchId() {
    let table_size = await matches_utils.getTableSize();
    return table_size;
}

exports.scheduleByFirstPolicy = scheduleByFirstPolicy;
exports.scheduleBySecondPolicy = scheduleBySecondPolicy;