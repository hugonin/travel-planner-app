const dotenv = require("dotenv");
dotenv.config();


const express = require("express");
const https = require("https");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("website"));

app.set("view engine", "ejs");

//Get Route setup
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.ejs");
});

//Post Route
app.post("/", addData);

function addData(req, res) {
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const query = req.body.cityName;
  const content = req.body.textContent;
  const today = new Date().toLocaleDateString("fr");


  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    unit +
    "&appid=" +
    apiKey;

  https.get(url, function (response) {

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("index", {
        city: query,
        tempResult: temp,
        descResult: description,
        imgResult: imageUrl,
        contentResult: content,
        todayResult: today,
      });

      req.on("error", (e) => {
        console.error(e);
      });
    });
  });
}

// Setup Server
let port = process.env.PORT;
if (port == null || port == "") {
  console.log(`Server running on ${port}`);
}
app.listen(port);