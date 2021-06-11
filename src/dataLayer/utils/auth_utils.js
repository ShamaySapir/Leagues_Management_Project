const DButils = require("../utils/DButils");

async function getUserInfo(username) {
  try {
    const user = await DButils.execQuery(
      `SELECT * FROM dbo.Users WHERE username = '${username}'`
    );

    let result = null;
    if (user && user.length) result = user[0];
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function insertUserInfo(user) {
  try {
    if (!user.image) {
      user.image = null;
    }

    await DButils.execQuery(
      `INSERT INTO dbo.Users (username, firstname, lastname, country, password , email , image) VALUES ('${user.username}','${user.firstName}', '${user.lastName}', '${user.country}', '${user.password}', '${user.email}', '${user.image}');`
    );
    return user;
  } catch (error) {
    console.error(error);
    throw error;
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
    throw error;
  }
}

async function checkUnionRep(userId) {
  try {
    const union_rep = await DButils.execQuery(
      `SELECT unionRepId FROM unionRep WHERE userId=${userId}`
    );
    let result = false;
    if (union_rep && union_rep.length) {
      result = true;
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function getUsers() {
  const users = await DButils.execQuery(`select * from dbo.Users`);

  return users;
}

exports.getUsers = getUsers;
exports.getUserInfo = getUserInfo;
exports.insertUserInfo = insertUserInfo;
exports.getUserId = getUserId;
exports.checkUnionRep = checkUnionRep;
