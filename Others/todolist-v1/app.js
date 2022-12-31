const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const date = require(__dirname + '/date.js');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

let items = ['Fan', 'Hairdryer', 'Curtain'];
let workItems = [];

app.get("/", function (req, res) {
  const day = date.dayDate();
  res.render('weekday', {listTitle: day, listItem: items});
});

app.get('/work', function(req, res) {
  res.render('weekday', {listTitle: "Work List", listItem: workItems})
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.post('/', function(req, res) {
  let item = req.body.newItem;

  if (req.body.addButton === "Work") {
    workItems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

app.listen("3000", function () {
  console.log("Server started on port 3000");
});