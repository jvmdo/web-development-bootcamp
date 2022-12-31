const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const lodash = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const ItemsSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  }
});

const Item = mongoose.model('Item', ItemsSchema);

const item1 = Item({
  name: "Finish this lesson"
});

const item2 = Item({
  name: "Do the code refactoring"
});

const item3 = Item({
  name: "Go to next lesson",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  const day = date.dayDate();

  Item.find(function(err, items){
    if (err) {
      console.log("Find error: ", err);
    } else {
      if (items.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log("Could not insert many items: ", err);
          } else {
            console.log("Many items successfully inserted!");
          }
        });
        console.log("Inserted default items into database.");
        res.redirect('/');
      } else {
        console.log("Find items!");
        // console.log(res);
        res.render('list', {listTitle: day, listItems: items});
      }
    }
  });
});

const listSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  items: [ItemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/:dynamics', function(req, res) {
  const listName = lodash.capitalize(req.params.dynamics);

  List.findOne({name: {$eq: listName}}, function(_, list) {
    if (!list) {
      const newList = new List({
        name: listName,
        items: defaultItems
      });
      newList.save();
      res.redirect(`/${listName}`);
    } else {
      res.render('list', {listTitle: list.name, listItems: list.items});
    }
  });
});

app.post('/', function(req, res) {
  const listTitle = req.body.listTitle;
  const newItem = new Item({
    name: req.body.newItem
  });

  if (listTitle === date.dayDate()) {
    newItem.save();
    res.redirect('/');
  } else {
    List.findOne({name: {$eq: listTitle}}, function(_, list) {
      if (list) {
        list.items.push(newItem);
        list.save();
      } else {
        console.log("Something went wrong");
      }
      res.redirect('/' + listTitle);
    });
  }
});

app.post('/delete', function(req, res) {
  const itemId = req.body.itemId;
  const listTitle = req.body.listTitle;

  if (listTitle === date.dayDate()) {
    Item.findByIdAndDelete(itemId, function(err) {
      if (err) {
        console.log("Could not remove item: ", err);
      } else {
        console.log(`Item corresponding to ID ${itemId} successfully removed from db`);
      }
    });
    res.redirect('/');
  } else {
    List.findOneAndUpdate(
      { name: { $eq: listTitle } },
      { $pull: { items: { _id: { $eq: itemId } } } },
      function(err, foundList) {
        if (err) {
          console.log("Found error: ", err);
        } else if (foundList) {
          console.log(`List corresponding to ID ${itemId} successfully removed from db`);
          res.redirect('/' + listTitle);
        } else {
          res.render('/error');
        }
      }
    );
  }
});

app.listen("3000", function () {
  console.log("Server started on port 3000");
});