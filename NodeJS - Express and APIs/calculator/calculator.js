const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

var n1, n2, result;

app.post('/', function (req, res) {
    n1 = req.body.num1;
    n2 = req.body.num2;
    result = Number(n1) + Number(n2);
    console.log(req.body);
    res.send('The result is ' + result);
});

app.get('/bmi', function(req, res) {
    res.sendFile(__dirname + '/bmi_calculator.html');
});

var h, w, bmi;

function bmiCalculator(weight, height) {
    weight = Number(weight);
    height = Number(height);
    bmi = weight / (height * height);
    return bmi.toFixed(2);
}

app.post('/bmi', function(req, res) {
    h = req.body.height;
    w = req.body.weight;
    bmi = bmiCalculator(w, h);
    res.send("<h1>Your BMI is " + bmi + "</h1>");
});

app.listen('3000', function() {
    console.log("Server started on port 3000");
});