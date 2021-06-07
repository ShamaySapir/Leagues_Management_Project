const axios = require("axios");
const { NText } = require("mssql");
const referee_utils = require("../dataLayer/utils/referee_utils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const auth_domain = require("../domainLayer/auth_domain");

async function CreateRefree(req) 
{
    let userName = req.body.userName;
    let userFirstName = req.body.userFirstname;
    let userLastName = req.body.userLastname;
    let country = req.body.country;
    let password = req.body.password;
    let email = req.body.email;
    let image;
  

    let user = 
    {
        username : userName,
        firstName : userFirstName,
        lastName :userLastName,
        country : country,
        password : password,
        email : email,
    }
    
    if(req.body.image)
    {
        image = req.body.image;
        user.image = image;
    }


    try
    {
        user = await auth_domain.userRegister(user);
    }
    catch (error)
    {
        throw { error: error}
    }

    try
    {
        await insertToRefreeTable(user);
    }
    catch (error)
    {
        throw { error: error}
    }


}


async function insertToRefreeTable(user)
{
    await referee_utils.insertRefereeInfo(user.userId,user.username)
} 

exports.CreateRefree = CreateRefree;