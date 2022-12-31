const express = require("express");
//const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); //! Needed to load static files from HTML sources

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/sign_up.html");
});

app.post('/', function (req, res) {
  // Grab data from HTML page
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  // Format data exactly the way API requires
  const apiDataFormat = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(apiDataFormat);

  const kk = "6362708942";
  const dc = "us7";
  const key = "82047ddcbfd378e55c7fdaf18998ab8b-us7"
  const options = {
    hostname: `${dc}.api.mailchimp.com`,
    path: `/3.0/lists/${kk}`,
    method: "POST",
    auth: `joatvictor:${key}`
  }

  const request = https.request(options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data)); 

      if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', function (req, res) {
  res.redirect('/');
})

app.listen('3000', function () {
  console.log("Server is running on port 3000");
});