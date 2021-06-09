const axios = require("axios");
const DButils = require("../utils/DButils");

async function getUserInfo(username) {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.Users WHERE username = '${username}'`
      )
    )[0];

    return user;
  } catch (error) {
    console.error(error);
    throw { error: error };
  }
}

async function insertUserInfo(user) {
  try {
    if (!user.image) {
      user.image = null;
    }

    DButils.execQuery(
      `INSERT INTO dbo.Users (username, firstname, lastname, country, password , email , image) VALUES ('${user.username}','${user.firstName}', '${user.lastName}', '${user.country}', '${user.password}', '${user.email}', '${user.image}');`
    );
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserId(user) {
  try {
    const user_id = (
      await DButils.execQuery(
        `SELECT userId FROM dbo.Users WHERE username = '${user.username}'`
      )
    )[0];
    return user_id.userId;
  } catch (error) {
    console.error(error);
  }
}

async function checkUnionRep(userId) {
  try {
    let union_rep = await DButils.execQuery(
      `SELECT unionRepId FROM unionRep WHERE userId=${userId}`
    );
    let len = union_rep.length;
    if (!union_rep || union_rep.length == 0) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
  }
}
async function getUsers() {
  let users = await DButils.execQuery(`select * from dbo.Users`);

  return users;
}

exports.getUsers = getUsers;
exports.getUserInfo = getUserInfo;
exports.insertUserInfo = insertUserInfo;
exports.getUserId = getUserId;
exports.checkUnionRep = checkUnionRep;
