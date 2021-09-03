const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080; //setting port
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  secret: 'rooney-ruud-scholes-keane'
}));

const { getUserByEmail, urlsForUser }  = require('./helpers'); // importing helper functions 


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));// activating body parser for POST requests


//generate random 6 character string
const generateRandomString = () => {

  return Math.random().toString(20).substr(2,6);

};





//declare empty object users
const users = {};

//set ejs as the engine
app.set("view engine", "ejs");

// stroring the shortened links in an object
const urlDatabase = {};

//on the get command send hello
app.get('/', (req,res) => {
  const templateVars = {urls : urlDatabase, user: users[req.session.user_id]};
  res.render("urls_home", templateVars);
});

//takes to the page that shows all the urls
app.get('/urls', (req,res) => {
  const userID = req.session.user_id;
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = {urls : userUrls, user: users[userID]};
  
  res.render("urls_index", templateVars);
});



//create new url
app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {user: users[req.session.user_id]};
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});
  

// generate random string and store it
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});

//shows the selected urls
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { urls: userUrls, user: users[userID], shortURL:req.params.shortURL };
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
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
  
});

//edit URL only if URL belongs to the logged in user
app.post("/urls/:shortURL", (req, res) => {
  const shortURL =  req.params.shortURL;
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.updatedURL;
  }
  res.redirect(`/urls/${shortURL}`);
  
});

//login page
app.get('/login', (req, res) => {
  const templateVars = {user: users[req.session.user_id]};
  res.render('urls_login', templateVars);

});

//handle login
app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = user.userID;
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

//handle logout, clear cookies and return to homepage
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

//User registration page
app.get('/register', (req, res) => {
  const templateVars = {user: users[req.session.user_id]};
  res.render('urls_register', templateVars);
});

//registration handler that creates the user and logs them into the site.
app.post("/register", (req,res) => {
  if (req.body.email && req.body.password) {
    if (!getUserByEmail(req.body.email, users)) {
      const userID = generateRandomString();
      const password = bcrypt.hashSync(req.body.password, 10);
      users[userID] = {
        userID,
        email: req.body.email,
        password: password
      };
      req.session.user_id = userID;
      res.redirect('/urls');
    } else {
      res.statusCode = 400;
      res.send(`<h3>400 Bad Request,<br> Email already exists</h3>`);
    }
  } else {
    res.send(`<h3>400 Bad Request,<br> Email and Password should be competed!</h3>`);
  }
});


//log to the console that the server is listening on port 8080.
app.listen(PORT, () => {
  console.log(`TinyApp URL shortener is listening on port: ${PORT}`);
});