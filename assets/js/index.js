//* global variables
let userInput = document.getElementById("user-input");
let searchBtn = document.getElementById("search-btn");
let apiKey = "32f1cece631ee89046fe3328471647a0";
let fiveDayEl = document.getElementById("five-day");
let fiveDayHeader = document.getElementById("fiveDayHeader");

//* 5day forecast div variable
let fiveDay = document.getElementById("five-day");

//* Search history  div variable and bucket array to hold user's past input
let searchHistEl = document.getElementById("search-hist");
let searchHistoryBucket = [];

//* FUNCTION to run at PAGELOAD, called at end of this file
function init() {
  let storedCities = JSON.parse(localStorage.getItem("Loc."));

  // if local storage isn't empty, update bucket with stored entries
  if (storedCities !== null) {
    searchHistoryBucket = storedCities;
  }
  showHistory();
}

//* FUNCTION to get items from Search History Bucket (e.g. local storage) and populate searchHistEl's
function showHistory() {
  searchHistEl.innerHTML = "";
  for (var i = 0; i < searchHistoryBucket.length; i++) {
    let historyBtn = document.createElement("button");
    historyBtn.setAttribute(
      "class",
      "history-btn border-0 rounded w-100 bg-secondary text-white p-1 m-1"
    );
    historyBtn.innerHTML = searchHistoryBucket[i];
    searchHistEl.appendChild(historyBtn);
  }
}

//* FUNCTION to store User Entries in local storage
function storeCities() {
  localStorage.setItem("Loc.", JSON.stringify(searchHistoryBucket));
}


//* FUNCTION to feed user's city into query and fetch geographic longitude and latitude.  Note: this API is convenient in that you can search by city name, but the response data is limited; hence the need for the fetchWeather METHOD (below)
function fetchCoords(city) {
  let userQueryUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    apiKey;

  fetch(userQueryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (coords) {
      let lat = coords[0].lat;
      let lon = coords[0].lon;
      fetchWeather(lat, lon); //TODO ADD A CONDITIONAL HERE TO DEAL WITH INVALID INPUT/EMPTY FIELD/duplicates? USE MODAL
    });

  //* METHOD to feed previous API's City coordinates into "data-rich" API. Note: this is a workaround for the "data-rich" API requiring long. and lat. coordinates to search for unique weather locations.
  function fetchWeather(lat, lon) {

    let url =
      "https://pro.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=imperial&exclude=minutely,hourly&appid=" +
      apiKey;

    fetch(url)
      .then((response) => response.json())
      .then((data) => renderWeather(data));
  }
  //* THE RENDER WEATHER function
  function renderWeather(weather) {
    console.log(weather);
    let results = document.getElementById("main-display");
    results.setAttribute(
      "class",
      "border border-2 border-dark bg-primary px-3 text-light"
    );

    //*  a UNIX TIMESTAMP CONVERTER to take unix value from API and convert it to a readable format
    let unixTimestamp = weather.current.dt * 1000;
    let day = new Date(unixTimestamp).toDateString();

    //* shortcut to weather array details
    let weatherDetails = weather.current.weather[0];

    //* Clear out the previous displays when rendering weather for a new city
    if (results !== null) {
      results.innerHTML = "";
    }
    if (fiveDayEl !== null) {
      fiveDayEl.innerHTML = "";
    }

    //* Items below to populate current weather in "results" div
    let cityInput = document.createElement("h2");
    cityInput.innerHTML = city + " " + "(" + day + ")";
    results.append(cityInput);

    let weatherImg = document.createElement("img");
    weatherImg.setAttribute(
      "src",
      "http://openweathermap.org/img/wn/" + weatherDetails.icon + ".png"
    );
    cityInput.appendChild(weatherImg);

    let temp = document.createElement("p");
    temp.innerHTML = "Temp: " + weather.current.temp + " °F";
    results.append(temp);

    let wind = document.createElement("p");
    wind.innerHTML = "Wind Speed: " + weather.current.wind_speed + " mph";
    results.append(wind);

    let humidity = document.createElement("p");
    humidity.innerHTML = "Humidity: " + weather.current.humidity + "%";
    results.append(humidity);

    let uvIndex = document.createElement("p");
    uvIndex.innerHTML = "UV Index: <span class='colorCode'> " + weather.current.uvi + "</span>";
    results.append(uvIndex);
    document.querySelector('.colorCode').classList.add[getUVColor()];

    //* FOR LOOP set to i=1, as we are looking for the next 5 days of weather for our cards.
    for (let i = 1; i < 6; i++) {
      let currentDay = weather.daily[i];
      makeFiveDay(currentDay);
    };
  };
};

// //* FUNCTION to create FIVE DAY forecast cards. Attribute details pulled directly from bootstrap cards.
function makeFiveDay(day) {

  //* sets the "Five Day Forecast" header to display upon five day rendering
  fiveDayHeader.style.display = "";

  let date = new Date(day.dt * 1000).toDateString();

  let cardContainer = document.createElement("div");
  cardContainer.setAttribute("class", "card bg-info col m-1");
  cardContainer.style.width = "15rem";
  fiveDayEl.append(cardContainer);

  let cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");
  cardContainer.append(cardBody);

  //* Card Title (our future day DATE)
  let cardTitle = document.createElement("p");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.textContent = date;
  cardContainer.append(cardTitle);

  //* Descriptive weather Icon
  let cardIcon = document.createElement("img");
  cardIcon.setAttribute(
    "src",
    "http://openweathermap.org/img/wn/" + day.weather[0].icon + ".png"
  );
  cardIcon.classList.add("w-50");
  cardContainer.append(cardIcon);

  //* Temperature readout:
  let cardTemp = document.createElement("p");
  cardTemp.setAttribute("class", "card-text");
  cardTemp.textContent = "Temp: " + day.temp.max;
  cardContainer.append(cardTemp);

  //* Wind readout:
  let cardWind = document.createElement("p");
  cardWind.setAttribute("class", "card-text");
  cardWind.textContent = "Wind: " + day.wind_speed + "mph";
  cardContainer.append(cardWind);

  //* Humidity Readout
  let cardHumidity = document.createElement("p");
  cardHumidity.setAttribute("class", "card-text");
  cardHumidity.textContent = "Humidity: " + day.humidity + "%";
  cardContainer.append(cardHumidity);

  return cardContainer;
  cardContainer.append(fiveDayEl);
};


function getUVColor(uvIndex) {
  if (uvIndex >= 0 && uvIndex <= 2) {
    return ".green";
  } else if (uvIndex >= 3 && uvIndex <= 5) {
    return ".yellow";
  } else if (uvIndex >= 6 && uvIndex <= 10) {
    return ".red";
  }
  //num is between whatever and etc) {return green;}
  //then call function in the weather render to span over the uv index)
};



//* THE ONE BUTTON TO RULE THEM ALL
searchBtn.addEventListener("click", function (event) {
  let userCity = userInput.value.trim();

  if (!userInput.value) {
    alert("Please enter a valid city/location");
    return;
  }
  //* push user's entry into global bucket (array)
  //TODO - create an IF CLAUSE to check entry against Search History

  //* INCLUDE is a search function (built in)
  if (searchHistoryBucket.includes(userCity) === false) {
    searchHistoryBucket.push(userCity);
  }
  userInput.value = "";

  fetchCoords(userCity);
  storeCities();
  showHistory();
});

searchHistEl.addEventListener("click", function (event) {
  let element = event.target;
  if (element.matches(".history-btn")) {
    fetchCoords(element.textContent);
  }
});

init();




//TODO: make text smaller for a better fit on the 5-day cards
//TODO: limit search history results to 5 cities/locations

//todo: darker background for 5-day
