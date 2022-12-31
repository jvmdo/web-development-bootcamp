const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("<h1>Hello from Express!</h1>");
});

app.get("/about", function (req, res) {
  res.send(
    "<lu><li>Estudante</li><li>Com motivacao</li><li>Incrivel!</li></lu>"
  );
});

app.listen(3000, function () {
  console.log("Server stated on port 3000");
});
