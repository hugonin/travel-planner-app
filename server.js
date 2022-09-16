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
const baseUrl = "http://api.geonames.org/searchJSON?q=";
const baseUrlWeather = "http://api.weatherbit.io/v2.0/forecast/daily?";
const baseUrlImage = "https://pixabay.com/api/?";
const baseUrlRestCountries = "https://restcountries.eu/rest/v3.1/name/";
const USERNAME = process.env.USERNAME;
const API_KEY_WEATHERBIT = process.env.API_KEY_WEATHERBIT;
const API_KEY_PIXABAY = process.env.API_KEY_PIXABAY;

// const second = 1000;
// const minute = second * 60;
// const hour = minute * 60;
// const day = hour * 24;
// let remaining = ""

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// console.log(countdown())

//Get Route setup
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.ejs");
});

//Post Route
app.post("/", async function (req, res) {
  const cityQuery = req.body.cityName;
  const dateEl = req.body.datePicker;
  const today = new Date().toLocaleDateString("fr");
  const year = new Date().getFullYear();

  const cityUrl = baseUrl + `${cityQuery}&maxRows=1&username=${USERNAME}`;
  const weatherUrl =
    baseUrlWeather + `city=${cityQuery}&key=${API_KEY_WEATHERBIT}`;
  const imageUrl =
    baseUrlImage +
    `&key=${API_KEY_PIXABAY}&q=${cityQuery}&image_type=all,photo`;
  //const restCountriesUrl = baseUrlRestCountries + `${country}`;

  const options = {
    method: "POST",
    credentials: "same-origin",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // let countdownActive = setInterval(() => {
  //   let countDownDate = new Date(dateEl).getTime();
  //   const now = new Date().getTime();
  //   const distance = countDownDate - now;
  //   console.log("distance", distance);

  //   const days = Math.floor(distance / day);
  //   const hours = Math.floor((distance % day) / hour);
  //   const minutes = Math.floor((distance % hour) / minute);
  //   const seconds = Math.floor((distance % minute) / second);
  //   console.log(days, hours, minutes, seconds);

  //   // if the countdown has ended, show complete
  //   if (distance > 0) {
  //     const parts = {
  //       days: Math.floor(distance / day),
  //       hours: Math.floor((distance / hour) % 24),
  //       minutes: Math.floor((distance / minute) % 60),
  //       seconds: Math.floor((distance / second) % 60),
  //     };
  //     remaining = Object.keys(parts)
  //       .map((part) => {
  //         return `${parts[part]} ${part}`;
  //       })
  //       .join(" ");
  //   }
  //   console.log("timer:", remaining);
  // }, second);

  Promise.all([
    fetch(cityUrl, options),
    fetch(weatherUrl, options),
    fetch(imageUrl, options),
    // fetch(restCountriesUrl, options),
  ])
    .then(function (responses) {
      return Promise.all(
        responses.map(function (res) {
          return res.json;
        })
      );
    })
    .then(function (json) {
      console.log(json);
    })
    .catch(function (err) {
      console.error("error:" + err);
    });

  try {
    let dLocation = await fetch(cityUrl, options);
    let dWeather = await fetch(weatherUrl, options);
    let dImage = await fetch(imageUrl, options);
    //let dRestCountries = await fetch(restCountriesUrl, options)

    dLocation = await dLocation.json();
    dWeather = await dWeather.json();
    dImage = await dImage.json();
    //dRestCountries = await dRestCountries.json()

    const latitude = dLocation.geonames[0].lat;
    const longitude = dLocation.geonames[0].lng;
    const country = dLocation.geonames[0].countryName;

    const temp = dWeather.data[0].temp;
    const description = dWeather.data[0].weather.description;
    const icon = dWeather.data[0].weather.icon;
    const imageTemp =
      "https://www.weatherbit.io/static/img/icons/" + icon + ".png";
    // const maxTemp = dWeather.data[0].max_temp
    // const minTemp = dWeather.data[0].min_temp
    const image = dImage.hits[0].webformatURL;

    //const currency = dRestCountries[0].currencies[0].name
    // const language = dRestCountries[0].languages[0].nativeName
    // const population = dRestCountries[0].population

    res.status(200);

    res.render("index", {
      city: cityQuery,
      date: dateEl,
      latResult: latitude,
      lonResult: longitude,
      countryResult: country,
      todayResult: today,
      yearResult: year,
      tempResult: temp,
      descResult: description,
      iconResult: imageTemp,
      imageResult: image,
      //  currencyResult: currency,
      // populationResult: population
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
