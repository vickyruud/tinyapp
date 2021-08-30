const express = require('express');
const app = express();
const PORT = 5000; //setting port

const bodyParser = require("body-parser");
const { name } = require('ejs');
app.use(bodyParser.urlencoded({extended: true}));// activating body parser for POST requests
const cookieParser = require('cookie-parser');
app.use(cookieParser());



//generate random 6 character string 
function generateRandomString() {

  return Math.random().toString(20).substr(2,6);

}

//check if email already exists
const checkIfEmailExists = (email) =>{
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};
const users = {};

//set ejs as the engine
app.set("view engine", "ejs");

// stroring the shortened links in an object
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//on the get command send hello
app.get('/', (req,res) => {
  res.send("Hello!");
});

//takes to the page that shows all the urls
app.get('/urls', (req,res) => {
  const templateVars = {urls : urlDatabase, user: users[req.cookies['user_id']]}
  res.render("urls_index", templateVars);
});



//create new url
app.get("/urls/new", (req, res) => {
  let templateVars = {user: users[req.cookies['user_id']]};
  res.render('urls_new', templateVars);
});

// generate random string and store it
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
})

//shows the selected urls
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies]['user_id'] };
  res.render("urls_show", templateVars);
});
//takes you to the long URL
app.get("/u/:shortURL" , (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//deletes URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
  
});

//editing URL
app.post("/urls/:shortURL", (req, res) => {
  const shortURL =  req.params.shortURL;
  urlDatabase[shortURL] = req.body.updatedURL
  res.redirect(`/urls/${shortURL}`);
  
});

//login page
app.get('/login', (req, res) => {
  let templateVars = {user: users[req.cookies['user_id']]};
  res.render('urls_login', templateVars);

});

//handle login
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");

});

//handle logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id', 'password');
  res.redirect('/urls');
})

//User registration page
app.get('/register', (req, res) => {
  let templateVars = {user: users[req.cookies['user_id']]};
  res.render('urls_register', templateVars);
});

//registration handler
app.post("/register", (req,res) => {
 console.log(req.body.email)
  
  if(req.body.email && req.body.password) {
    if (!checkIfEmailExists(req.body.email)) {
      let userID = generateRandomString();
      users[userID] = {
      userID,
      email: req.body.email,
      password: req.body.password
      }
      res.cookie("user_id", userID);
      res.cookie("password", users[userID].password);
      res.redirect('/urls');
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
  console.log(`Example app is listening on port: ${PORT}`);
});