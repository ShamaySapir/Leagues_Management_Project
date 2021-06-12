const auth_utils = require("../dataLayer/utils/auth_utils");

// TODO change to const!!
// TODO how do you know why it returns false? there are 2 possible problems
async function login(username, password) {
  //check if login is post request or get
  try {
    let userInfo = await auth_utils.getUserInfo(username);
    let user_password = userInfo.password;

    // check that username exists & the password is correct

    if (!userInfo || password != user_password) {
      // throw { status: 401, message: "Username or Password incorrect" };
      return false;
    }
    return userInfo.userId;
  } catch (error) {
    console.error("error logging user");
    throw error;
  }
}

async function userRegister(userObj) {
  try {
    let user;
    //TODO: change to const
    let user_info = await auth_utils.getUserInfo(userObj.username);

    // TODO: check if user is in the system already and ask bar if a user name is uniq or not
    if (!user_info) {
      user = await auth_utils.insertUserInfo(userObj);
    } else {
      throw { message: "User already exist" };
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error({ error });
  }
}
async function getUsers() {
  users = await auth_utils.getUsers();
  return users;
}

exports.getUsers = getUsers;
exports.login = login;
exports.userRegister = userRegister;
