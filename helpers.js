//check if email already exists in database
const getUserByEmail = (email, database) =>{
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return undefined;
};

//check and retrieve urls for each user
const urlsForUser = (id, database) => {
  let userUrls = {};

  for (url in database ) {
    if (database[url].userID === id) {
      userUrls[url] = database[url];
    }
  }
  return userUrls;
}


module.exports = { 
  getUserByEmail,
  urlsForUser};