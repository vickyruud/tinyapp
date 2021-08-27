const express = require('express');
const app = express();
const PORT = 3000; //default port 3000

const bodyParser = require("body-parser");
const { name } = require('ejs');
app.use(bodyParser.urlencoded({extended: true}));// activating body parser for POST requests
const cookieParser = require('cookie-parser');
app.use(cookieParser());

function generateRandomString() {

  return Math.random().toString(20).substr(2,6);

}

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
  const templateVars = { urls: urlDatabase, username: req.cookies['username']};
  res.render("urls_index", templateVars);
});



//create new url
app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies['username']};
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
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies['username'] };
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
  
})

//handle login
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");

})

//handle logout
app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username);
  res.redirect("/urls");

})

//log to the console that the server is listening on port 8080.
app.listen(PORT, () => {
  console.log(`Example app is listening on port: ${PORT}`);
});