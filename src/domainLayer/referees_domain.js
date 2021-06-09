const axios = require("axios");
const referee_utils = require("../dataLayer/utils/referee_utils");
const auth_domain = require("../domainLayer/auth_domain");
const matches_utils = require("../dataLayer/utils/matches_utils");
const DButils = require("../dataLayer/utils/DButils.js");
const auth_utils = require("../dataLayer/utils/auth_utils");

async function CreateReferee(req) {
    let userName = req.body.userName;
    let userFirstName = req.body.firstName;
    let userLastName = req.body.lastName;
    let country = req.body.country;
    let password = req.body.password;
    let email = req.body.email;
    let image;
    let matchId = null;

    let user = {
        username: userName,
        firstName: userFirstName,
        lastName: userLastName,
        country: country,
        password: password,
        email: email,
    };


    if (req.body.image) {
        image = req.body.image;
        user.image = image;
    }

    if (req.body.matchId) {
        matchId = req.body.matchId;
    }

    try {
        // user = await auth_domain.userRegister(user);
    } catch (error) {
        console.error(error);
        throw { error: error };
    }


    try {
        let insertion_success = await insertToRefreeTable(user);
        //TODO : decide what to do if match id is null.
        if (insertion_success && matchId) {
            let refereeId = await referee_utils.getRefereeID(user.username);
            let assigned = await assignRefereeToMatch(refereeId, matchId);
            return assigned;
        }

    } catch (error) {
        throw { error };
    }
}

async function insertToRefreeTable(user) {
    const userId = await auth_utils.getUserId(user);
    let referee_exist = await referee_utils.getRefereeID(user.username);
    if (referee_exist) {
        throw { error: "Referee already exist" };
    }
    let referee_added = await referee_utils.insertRefereeInfo(userId, user.username);
    return referee_added;
}


async function assignRefereeToMatch(refereeId, matchId) {
    if (matchId == null) {
        throw { error: "matchId required" };
    }

    let matches = await matches_utils.getMatches();

    const isMatchPresent = matches.find((match) => match.matchId === matchId);
    if (!isMatchPresent) {
        throw { error: "match doesnt exist" };
    }
    matches_utils.UpdateRefereeToMatch(matchId, refereeId);
    return true;
}
exports.CreateReferee = CreateReferee;