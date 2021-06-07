const axios = require("axios");
const { NText } = require("mssql");
const referee_utils = require("../dataLayer/utils/referee_utils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const auth_domain = require("../domainLayer/auth_domain");
const auth_utils = require("../dataLayer/utils/auth_utils");
const matches_utils = require("../dataLayer/utils/matches_utils");
const DButils = require("../dataLayer/utils/DButils.js");


async function CreateReferee(req) {
    let userName = req.body.username;
    let userFirstName = req.body.firstName;
    let userLastName = req.body.lastName;
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
        console.log(error);
    }

    try {
        await insertToRefereeTable(user);
    } catch (error) {
        throw { error: error }
    }

    try {
        //await insertToRefreeTable(user);
        await RegisterArefereeToMatch();
    } catch (error) {
        throw { error: error }
    }
}

async function RegisterArefereeToMatch() {
    //let matches = await matches_utils.getMatches();
    let matches = await DButils.getTableSize('Users');
    let user = 4;
}

async function insertToRefereeTable(user) {
    await referee_utils.insertRefereeInfo(user);
}

exports.CreateReferee = CreateReferee;