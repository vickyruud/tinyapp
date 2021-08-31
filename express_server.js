const express = require('express');
const app = express();
const PORT = 5000; //setting port
const bcrypt = require('bcrypt');


const bodyParser = require("body-parser");
const { name } = require('ejs');
app.use(bodyParser.urlencoded({extended: true}));// activating body parser for POST requests
const cookieParser = require('cookie-parser');
app.use(cookieParser());



//generate random 6 character string 
function generateRandomString() {

  return Math.random().toString(20).substr(2,6);

}

//check if email already exists in database
const checkIfEmailExistsInDatabase = (email, database) =>{
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


//declare empty object users
const users = {};

//set ejs as the engine
app.set("view engine", "ejs");

// stroring the shortened links in an object
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID : "asd3f4"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "l2k3j4"}
};

//on the get command send hello
app.get('/', (req,res) => {
  const templateVars = {urls : urlDatabase, user: users[req.cookies['user_id']]}
  res.render("urls_home", templateVars);
});

//takes to the page that shows all the urls
app.get('/urls', (req,res) => {
  const userID = req.cookies['user_id'];
  const userUrls = urlsForUser(userID);
  const templateVars = {urls : userUrls, user: users[userID]}
  
  res.render("urls_index", templateVars);
});



//create new url
app.get("/urls/new", (req, res) => {
  if (req.cookies['user_id']) {
    let templateVars = {user: users[req.cookies['user_id']]};
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});
  

// generate random string and store it
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies['user_id']
  };
  res.redirect(`/urls/${shortURL}`);
})

//shows the selected urls
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies['user_id'];
  const userUrls = urlsForUser(userID);
  const templateVars = { urls: userUrls, user: users[userID], shortURL:req.params.shortURL }
  res.render("urls_show", templateVars);
});
//takes you to the long URL
app.get("/u/:shortURL" , (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//deletes URL only if the url belongs to the logged in user
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.cookies['user_id'] === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
  } 
  res.redirect("/urls");
  
});

//editing URL only if URL belongs to the logged in user
app.post("/urls/:shortURL", (req, res) => {
  const shortURL =  req.params.shortURL;
  if (req.cookies['user_id'] == urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.updatedURL;
  }
  res.redirect(`/urls/${shortURL}`);
  
});

//login page
app.get('/login', (req, res) => {
  const templateVars = {user: users[req.cookies['user_id']]};
  res.render('urls_login', templateVars);

});

//handle login
app.post("/login", (req, res) => {
  const user = checkIfEmailExistsInDatabase(req.body.email, users);
  if (user) {
   if (bcrypt.compareSync(req.body.password, user.password)) {
    res.cookie("user_id", user.userID);
    res.cookie("password", user.password);
    res.redirect('/urls');
   } else {
    res.statusCode = 400;
    res.send('<h3>403 Forbidden Request!<br> Incorrect Password<h3>');
   }
   } else {
    res.statusCode = 400;
    res.send('<h3>403 Forbidden Request!<br> User does not exist<h3>');
   }  
});

//handle logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

//User registration page
app.get('/register', (req, res) => {
  const templateVars = {user: users[req.cookies['user_id']]};
  res.render('urls_register', templateVars);
});

//registration handler that creates the user and redirects to the login page so that the user can login.
app.post("/register", (req,res) => {
  if(req.body.email && req.body.password) {
    if (!checkIfEmailExistsInDatabase(req.body.email, users)) {
      const userID = generateRandomString();
      const password = bcrypt.hashSync(req.body.password, 10);
      users[userID] = {
      userID,
      email: req.body.email,
      password: password
      }
    res.redirect('/login');
    } else {
      res.statusCode = 400
      res.send(`<h3>400 Bad Request,<br> Email already exists</h3>`);
    }
  } else {
    res.send(`<h3>400 Bad Request,<br> Email and Password should be competed!</h3>`);
  }
  console.log(users);
});


//log to the console that the server is listening on port 8080.
app.listen(PORT, () => {
  console.log(`TinyApp URL shortener is listening on port: ${PORT}`);
});