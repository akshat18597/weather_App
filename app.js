
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=0f8f083e40dbf67558a09287c99666a3&units=metric";

  const request = https.get(apiKey, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const weatherInfo = JSON.parse(data);
        const temperature = weatherInfo.main.temp;
        const description = weatherInfo.weather[0].description;

        res.write(`<h1>The temperature of ${query} is ${temperature} degrees Celsius.</h1>`);
        res.write(`Description: ${description}`);
        res.write(`<a href="/">Go back</a>`);
        res.send();
      } catch (error) {
        console.error("Parsing error:", error);
        res.redirect("/");
      }
    });
  });

  request.on("error", (error) => {
    console.error("Request error:", error);
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Listening at port 3000");
});
