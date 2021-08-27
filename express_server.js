const express = require('express');
const app = express();
const PORT = 5000; //setting port

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));// activating body parser for POST requests

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
  const templateVars = { urls: urlDatabase}
  res.render("urls_index", templateVars);
});

app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});

//create new url
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// generate random string and store it
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
})

//shows the selected urls
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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



//log to the console that the server is listening on port 8080.
app.listen(PORT, () => {
  console.log(`Example app is listening on port: ${PORT}`);
});