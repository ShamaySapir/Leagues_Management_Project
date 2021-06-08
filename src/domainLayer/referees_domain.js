const axios = require("axios");

const referee_utils = require("../dataLayer/utils/referee_utils");
const auth_domain = require("../domainLayer/auth_domain");
const matches_utils = require("../dataLayer/utils/matches_utils");
const DButils = require("./dataLayer/utils/DButils.js");

async function CreateRefree(req) {
    let userName = req.body.userName;
    let userFirstName = req.body.userFirstname;
    let userLastName = req.body.userLastname;
    let country = req.body.country;
    let password = req.body.password;
    let email = req.body.email;
    let image;

    let user = {
        username: userName,
        firstName: userFirstName,
        lastName: userLastName,
        country: country,
        password: password,
        email: email,
    }

    if (req.body.image) {
        image = req.body.image;
        user.image = image;
    }


    try {
        user = await auth_domain.userRegister(user);
    } catch (error) {
        throw { error: error }
    }

    try {
        await insertToRefreeTable(user);
        await assignRefereeToMatch();
    } catch (error) {
        throw { error: error }
    }
}

async function insertToRefreeTable(user) {
    await referee_utils.insertRefereeInfo(user.userId, user.username)
}

async function assignRefereeToMatch() {
    //let matches = await matches_utils.getMatches();
    let matchesLength = await DButils.getTableSize('matches');
    let refereeLength = await DButils.getTableSize('Referees');

    // in case the referee is less then then the games
    if (refereeLength <= matchesLength) {
        matches_utils.UpdateRefereeToMatch(refereeLength, refereeLength);
    } else if (refereeLength) {
        let matchId = Math.floor(Math.random() * (matchesLength)) + 1;
        matches_utils.UpdateRefereeToMatch(matchId, refereeLength);
    }


}


exports.CreateRefree = CreateRefree;