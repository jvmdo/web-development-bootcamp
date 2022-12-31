const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "I have outdated tutorials.",
  resave: false,
  saveUninitialized: false
}));

mongoose.connect('mongodb://localhost:27017/secretsDB');

app.use(passport.initialize());
app.use(passport.session());

const secretSchema = new mongoose.Schema({
  username: String,
  password: String,
  secret: [String]
});

secretSchema.plugin(passportLocalMongoose, {
  saltlen: 8,
  iterations: 16,
  keylen: 32,
  hashField: 'passwordHashed'
});

const Secret = mongoose.model('Secret', secretSchema);

passport.use(Secret.createStrategy());
passport.serializeUser(Secret.serializeUser());
passport.deserializeUser(Secret.deserializeUser());

app.get('/', function(_, res) {
  res.render('home');
});

app.get('/login', function(_, res) {
  res.render('login');
});

app.get('/register', function(_, res) {
  res.render('register');
});

app.get('/secrets', function(req, res) {
  if (req.isAuthenticated()) {
    Secret.find({secret: {$ne: null} }, function (err, users) {
      if (err) {
        console.log("Can't find users' secrets: ", err);
      } else {
        const secrets = users.map(user => user.secret);
        res.render('secrets', { userSecrets: secrets });
      }
    })
  } else {
    res.redirect('/');
  }
});

app.get('/submit', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('submit');
  } else {
    res.redirect('/');
  }
});

app.get('/logout', function(req, res) {
  req.logOut(function(err) {
    if (err) {
      console.log("logout error: ", err);
    } else {
      console.log(`Some user just logged out.`);
      res.redirect('/');
    }
  });
});

app.post("/register", function(req, res) {
  Secret.register({username: req.body.username}, req.body.password, function(err, _) {
    if (err) {
      console.log("An error occurred during register: ", err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        console.log(`User ${req.body.username} successfully registered.`);
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/login", function(req, res){
  const user = new Secret(req.body);
  req.login(user, function(err) {
    if (err) {
      console.log(`Could not login user ${user.username}: `, err);
    } else {
      passport.authenticate("local")(req, res, function() {
        console.log(`User ${req.body.username} just logged in.`);
        res.redirect("/secrets");
      });
    }
  });
});

app.post('/submit', function(req, res) {
  // user property is avaiable when a user is authenticated
  Secret.findOneAndUpdate(
    { username: req.user.username }, 
    { $push: { secret: req.body.secret } },
    function(err, user) {
    if (err) {
      console.log("Could not find by id: ", err);
    } else {
      console.log(`User ${user.username}'s secret successfully updated.`);
      res.redirect('secrets');
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});