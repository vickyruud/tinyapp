//check if email already exists in database
const getUserByEmail = (email, database) =>{
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return undefined;
};

//check urls for each user
const urlsForUser = (id) => {
  let userUrls = {};

  for (url in urlDatabase ) {
    if (urlDatabase[url].userID === id) {
      userUrls[url] = urlDatabase[url];
    }
  }
  return userUrls;
}

module.exports = { 
  getUserByEmail,
  urlsForUser};