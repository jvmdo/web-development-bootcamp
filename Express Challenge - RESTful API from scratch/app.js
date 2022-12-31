const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const ArticleSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  content: {
    required: true,
    type: String
  }
});

const Article = mongoose.model('Article', ArticleSchema);

// An API is defined as RESTful when it makes use of the HTTP verbs 
// (get, post, update/fetch, delete) and the route names convention
app.route('/articles')
  .get(function(_, res) {
    Article.find({})
      .then(function(docs) {
        console.log("Articles found!");
        const articles = docs.map(doc => ({ title: doc.title, content: doc.content }));
        res.send(articles);
      })
      .catch(function(err) {
        console.log("Could not get all the articles: ", err);
        res.status(500).send(`Could not get all the articles: ${err}`);
      });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (err) {
        console.log("Could not add new article: ", err);
        res.status(400).send(`Could not add new article: ${err}`);
      } else {
        res.send("New article successfully added.");
      }
    });
  })
  .delete(function(_, res) {
    Article.deleteMany({}, function(err) {
      if (err) {
        console.log("Could not delete articles: ", err);
        res.status(500).send(`Could not delete articles: ${err}`);
      } else {
        res.send("All articles successfully deleted.");
      }
    });
  });

app.route('/articles/:searchTerm')
  .get(function(req, res) {
    const searchTerm = req.params.searchTerm;
    Article.findOne({ title: {$regex : new RegExp(`^${searchTerm}$`, "i")} })
      .then(doc => {
        if (doc) {
          res.json({ title: doc.title, content: doc.content });
        } else {
          res.status(404).send(`Article entitled "${searchTerm}" not found.`);
        }
      }).catch(err => console.log(err));
  })
  .put(function(req, res) {
    const searchTerm = req.params.searchTerm;
    const newTitle = req.body.title;
    const newContent = req.body.content;
    Article.replaceOne(
      { title: {$regex : new RegExp(`^${searchTerm}$`, "i")} },
      { title: newTitle, content: newContent },
    ).then(doc => {
      if (doc.matchedCount) {
        res.send("Article successfully updated!");
      } else {
        res.status(404).send("No articles with this title were found.");
      }
    }).catch(err => console.log(err));
  })
  .patch(function(req, res) {
    const searchTerm = req.params.searchTerm;
    const newTitle = req.body.title;
    const newContent = req.body.content;
    Article.updateOne(
      { title: {$regex : new RegExp(`^${searchTerm}$`, "i")} },
      { title: newTitle, content: newContent }, // req.body has the exactly same fields
    ).then(doc => {
      if (doc.acknowledged) {
        res.send("Article successfully updated!");
      } else {
        res.status(404).send("No articles with this title were found.");
      }
    }).catch(err => console.log(err));
  })
  .delete(function(req, res) {
    const searchTerm = req.params.searchTerm;
    Article.deleteOne(
      { title: {$regex : new RegExp(`^${searchTerm}$`, "i")} },
    ).then(doc => {
      if (doc.acknowledged) {
        res.send("Article successfully deleted!");
      } else {
        res.status(404).send("No articles with this title were found.");
      }
    }).catch(err => console.log(err));
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});