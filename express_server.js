const express = require('express');
const app = express();
const PORT = 8080; //default port 8080

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

app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase}
  res.render("urls_index", templateVars);
});

app.get('/hello', (req, res) => {
  res.send('<html><body> Hello <b>World</b></body></html>\n');
});



//log to the console that the server is listening on port 8080.
app.listen(PORT, () => {
  console.log(`Example app is listening on port: ${PORT}`);
});