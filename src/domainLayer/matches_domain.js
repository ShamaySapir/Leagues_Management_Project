const axios = require("axios");
const { NText } = require("mssql");
const matches_utils = require("../dataLayer/utils/matches_utils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const auth_utils = require("../dataLayer/utils/auth_utils");

//policy == 1 : schedule matches so every two teams in the leage play together once
async function scheduleByFirstPolicy(leagueId, seasonId) {
  let teams = await axios.get(`${api_domain}/teams/season/${seasonId}`, {
    params: {
      include: "league",
      api_token: process.env.api_token,
    },
  });
  teams = getTeamsByLeagueId(teams, leagueId);
  console.log("---------------------");

  let season = await axios.get(`${api_domain}/seasons/${seasonId}`, {
    params: {
      api_token: process.env.api_token,
    },
  });

  let matches = [];
  //TODO: check how the teams look like
  let season_name = season.data.data.name;
  let years = season_name.split("/");
  let year = years[0];
  var date = year + "-01-01";
  date = new Date(date).toDateString();

  for (let index = 0; index < teams.length; index++) {
    for (let j = index + 1; j < teams.length; j++) {
      let stage_id = await getStageBySeasonId(seasonId);
      let stadium = await getStadium(teams[index].id);
      let match = {
        leagueId: leagueId,
        seasonId: seasonId,
        stageId: stage_id,
        matchDate: date,
        matchHour: "20:00:00",
        homeTeam: teams[index].name,
        awayTeam: teams[j].name,
        stadium: stadium,
        refereeId: null,
        score: null,
      };

      matches.push(match);
      date = addDays(date, 7);
    }
  }
  console.log(matches);

  //add matches to DB

  let wrote_to_DB = await writeToDB(matches, "matches");
  if (!wrote_to_DB) {
    console.error("failed to write matches to DB");
    throw error;
  }

  return matches;
}

async function writeToDB(data, table_name) {
  try {
    if (table_name == "matches") {
      let add_matches = await matches_utils.addMatchesToDB(data);
      return add_matches;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
}

async function scheduleBySecondPolicy(leagueId, seasonId) {
  console.log("policy 2!!!!!!!!!!!!!");
  let teams = await axios.get(`${api_domain}/teams/season/${seasonId}`, {
    params: {
      include: "league",
      api_token: process.env.api_token,
    },
  });
  teams = getTeamsByLeagueId(teams, leagueId);
  //   console.log(teams.data.data);
  //   console.log("---------------------");

  let season = await axios.get(`${api_domain}/seasons/${seasonId}`, {
    params: {
      api_token: process.env.api_token,
    },
  });

  let firstRoundMatches = [];
  //TODO: check how the teams look like
  let season_name = season.data.data.name;
  let years = season_name.split("/");
  let year = years[0];
  var date = year + "-01-01";
  date = new Date(date).toDateString();

  for (let index = 0; index < teams.length; index++) {
    for (let j = index + 1; j < teams.length; j++) {
      let stage_id = await getStageBySeasonId(seasonId);
      let stadium = await getStadium(teams[index].id);
      let awayTeam_stadium = await getStadium(teams[j].id);
      let match = {
        leagueId: leagueId,
        seasonId: seasonId,
        stageId: stage_id,
        matchDate: date,
        matchHour: "20:00:00",
        homeTeam: teams[index].name,
        awayTeam: teams[j].name,
        homeTeamId: teams[index].id,
        awayTeamId: teams[j].id,
        stadium: stadium,
        awayTeam_stadium: awayTeam_stadium,
        refereeId: null,
        score: null,
      };

      firstRoundMatches.push(match);
      date = addDays(date, 7);
    }
  }
  //   secondRoundMatches = [...firstRoundMatches];
  var secondRoundMatches = JSON.parse(JSON.stringify(firstRoundMatches));
  //switch between homeTeam and awayTeam fot the second round

  secondRoundMatches.map(async (match) => {
    try {
      //new parameters
      date = addDays(date, 7);
      let former_homeTeam = match.homeTeam;
      let former_awayTeam = match.awayTeam;
      let former_homeTeamId = match.homeTeamId;
      let former_awayTeamId = match.awayTeamId;
      let stadium = match.awayTeam_stadium;
      //update

      // match.matchId = match_id;
      match.homeTeam = former_awayTeam;
      match.awayTeam = former_homeTeam;
      match.homeTeamId = former_awayTeamId;
      match.awayTeamId = former_homeTeamId;
      // match.stadium = getStadium(former_awayTeam.id);
      match.stadium = stadium;
      // match.date = date;
    } catch (error) {
      console.error(error);
    }
  });

  allMatches = firstRoundMatches.concat(secondRoundMatches);

  //add matches to DB
  let wrote_to_DB = await writeToDB(allMatches, "matches");
  if (!wrote_to_DB) {
    console.error("failed to write matches to DB");
    throw error;
  }
  return allMatches;
}

function getTeamsByLeagueId(teams_info, leagueId) {
  let index = 0;
  let validTeams = [];
  teams_info.data.data.map((team_info) => {
    const { league } = team_info;
    const { id } = league.data;

    if (id == leagueId) {
      validTeams.push(team_info);
    }
    index++;
  });
  return validTeams;
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

//check if user is union rep

async function UserIsUnionRep(userId) {
  if (userId === undefined) {
    return false;
  }

  const isUnionRep = await auth_utils.checkUnionRep(userId);
  return isUnionRep;
}
async function getMatches() {
  matches = await matches_utils.getMatches();
  return matches;
}

exports.getMatches = getMatches;
exports.scheduleByFirstPolicy = scheduleByFirstPolicy;
exports.scheduleBySecondPolicy = scheduleBySecondPolicy;
exports.UserIsUnionRep = UserIsUnionRep;
