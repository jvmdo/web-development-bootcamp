//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/journalDB');

const PostSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  body: {
    required: true,
    type: String
  }
});

const Post = mongoose.model('Post', PostSchema);

app.get('/', function(_, res) {
  // Read all documents in Post collections
  Post.find({}, function(err, docs) {
    if (err) {
      console.log("Could not find posts: ", err);
    } else {
      console.log("Posts found!");
      // Convert from document to JS Object then push them into an array
      const posts = docs.map(p => ({title: p.title, body: p.body}));
      res.render('home', {p1: homeStartingContent, comps: posts}); 
    }
  })
});

app.get('/about', function(_, res) {
  // Remember: render() does not require the entire file path
  res.render('about', {p2: aboutContent}); 
});

app.get('/contact', function(_, res) {
  res.render('contact', {p3: contactContent}); 
});

app.get('/compose', function(_, res) {
  res.render('compose'); 
});

app.get('/posts/:postTitle', function(req, res) {
  const postTitle = _.lowerCase(req.params.postTitle);

  Post.findOne({ title: postTitle }, function(err, postDoc) {
    if (err || !postDoc) {
      console.log("Could not find the post: ", err);
    } else {
      res.render('post', {postTitle: postDoc.title, postBody: postDoc.body});
    }
  });
});

app.post('/', function(req, res) {
  const post = new Post({
    title: _.lowerCase(req.body.title),
    body: req.body.body
  });
  // Redirect after the save is completed
  post.save(function(err) {
    if (err) {
      console.log("Could not save the post: ", err);
    } else {
      res.redirect('/');
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});