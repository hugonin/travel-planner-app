const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("website"));

app.set("view engine", "ejs");

/* Global API Variables */
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const API_KEY = process.env.API_KEY;

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

//Get Route setup
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.ejs");
});

//Post Route
app.post("/", async function (req, res) {
  const query = req.body.cityName;
  const content = req.body.textContent
  const today = new Date().toLocaleDateString("fr");
  const year = new Date().getFullYear();
  const unit = "metric";
  const url = baseUrl + `${query}&units=${unit}&appid=${API_KEY}`;
  const options = {
    method: "POST",
    credentials: "same-origin",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));

  try {
    let response = await fetch(url, options);
    response = await response.json();

    const temp = response.main.temp;
    const description = response.weather[0].description;
    const icon = response.weather[0].icon;
    const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

    res.status(200);

    res.render("index", {
      city: query,
      tempResult: temp,
      descResult: description,
      imgResult: imageUrl,
      contentResult: content,
      todayResult: today,
      yearResult: year,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: `Internal Server Error` });
  }
});


// Setup Server
const PORT = process.env.PORT || 8000;

console.log(`Server running on ${PORT}`);

app.listen(PORT);
