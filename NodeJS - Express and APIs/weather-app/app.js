const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const https = require('https');

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html"); 
});

app.post('/', function(req, res) {
    const cityName = req.body.cityName;
    const key = "87bf20fa0aa205f5d229a23cebecb92a";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${key}`;
    
    https.get(url, function (response) {
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write(`<h1>The temperature in ${cityName} is ${temp} degrees Celcius</h1>`);
            res.write(`<h2>The weather is currently ${desc} </h2>`);
            res.write(`<img src=${iconUrl}>`)
            res.send();
        });
    });
});

app.listen('3000', function() {
    console.log("Server started on port 3000");
});