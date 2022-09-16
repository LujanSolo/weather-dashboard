//! global variables
let userInput = document.getElementById("user-input");
let searchBtn = document.getElementById("search-btn");
let apiKey = "32f1cece631ee89046fe3328471647a0";
let fiveDayEl = document.getElementById("five-day");

//! 5day forecast div variable
let fiveDay = document.getElementById("five-day");

//! Search history  div variable and bucket array to hold user's past input
let searchHistEl = document.getElementById("search-hist");
let searchHistoryBucket = [] //! had set it to a const, rather than a changeable variable. see ln 24

//! FUNCTION to run at PAGELOAD, call at end of index.js
function init() {
  let storedCities = JSON.parse(localStorage.getItem("Loc."));//!was passing in incorrect key name
  console.log(storedCities)
  // if local storage isn't empty, update bucket with stored entries
  if (storedCities !== null) {
    searchHistoryBucket = storedCities; //!this was getting overridden
  };
  showHistory();
};

//! FUNCTION to get items from Search History Bucket (e.g. local storage) and populate searchHistEl's
function showHistory() {
  searchHistEl.innerHTML = "";
  for (var i=0; i < searchHistoryBucket.length; i++) {
  let historyBtn = document.createElement("button");
  historyBtn.setAttribute("class", "btn btn-secondary m-1 text-center text-light border rounded")
  historyBtn.innerHTML = searchHistoryBucket [i];
  searchHistEl.appendChild(historyBtn);
  }
};

//! FUNCTION to store User Entries in local storage
function storeCities() {
  localStorage.setItem("Loc.", JSON.stringify(searchHistoryBucket))
}

//! FUNCTION to feed user's city into query and fetch geographic longitude and latitude.  Note: this API is convenient in that you can search by city name, but the response data is limited; hence the need for the fetchWeather METHOD (below)
function fetchCoords(city) {
  let userQueryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;

  fetch(userQueryUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (coords) {
    let lat = coords[0].lat;
    let lon = coords[0].lon;
    fetchWeather(lat, lon);
  });

  //! METHOD to feed previous API's City coordinates into "data-rich" API. Note: this is a workaround for the "data-rich" API requiring long. and lat. coordinates to search for unique weather locations.
  function fetchWeather(lat, lon) {
    console.log("The coordinates are latitude:", lat, " and longitude:", lon);
  
    let url = "https://pro.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
  
    fetch(url)
    .then((response) => response.json())
    .then((data) => renderWeather(data));
  };
  
  
  function renderWeather(weather) {
    console.log(weather);
  
    let results = document.getElementById("main-display");
    

    //!  a UNIX TIMESTAMP CONVERTER to take unix value from API and convert it to a readable format
    let unixTimestamp = weather.current.dt*1000;
    let day = (new Date(unixTimestamp).toDateString()); 
    
    //! shortcut to weather array details
    let weatherDetails = weather.current.weather[0];

    if (results !== null) {
      results.innerHTML = "";
    }

    //!items below to populate current weather in "results" div 
    let cityInput = document.createElement("h2");
    cityInput.innerHTML =  city + ' ' + "(" + day +")";
    results.append(cityInput);
  
    let weatherImg = document.createElement("img");
    weatherImg.setAttribute("src", ("http://openweathermap.org/img/wn/" + weatherDetails.icon + ".png"));
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
    uvIndex.innerHTML = "UV Index: " + weather.current.uvi;
    results.append(uvIndex); //todo: Add color coded <SPAN> over uvIndex

    //! FOR LOOP set to i=1, as we are looking for the next 5 days of weather for our cards.
    for (let i = 1; i < 6; i++) {
      let currentDay = weather.daily[i];
      makeFiveDay(currentDay);
      }
  };
};
// console.log(makeFiveDay());

// //! FUNCTION to create FIVE DAY forecast cards. Attribute details pulled directly from bootstrap cards. 
function makeFiveDay(day) {
  console.log(day);

  let date = (new Date(day.dt*1000).toDateString()); 
  console.log(date);


  let cardContainer = document.createElement("div");
  cardContainer.setAttribute('class', "card bg-primary m-2");
  cardContainer.style.width = '15rem';
  fiveDayEl.append(cardContainer);


  let cardBody = document.createElement("div");
  cardBody.setAttribute('class', "card-body");
  cardContainer.append(cardBody);


  //! Card Title (our future day DATE)
  let cardTitle = document.createElement("h6");
  cardTitle.setAttribute('class', "card-title text-left");
  cardTitle.textContent = date;
  cardBody.append(cardTitle);
  
  //! Descriptive weather Icon
  let cardIcon = document.createElement("img");
  cardIcon.setAttribute("src", ("http://openweathermap.org/img/wn/" + day.weather[0].icon + ".png"));
  cardBody.append(cardIcon);

  //! Temperature readout:
  let cardTemp = document.createElement("p");
  cardTemp.setAttribute('class', "card-text");
  cardTemp.textContent = "High temp.: " + day.temp.max;
  console.log(day.temp.max);
  cardBody.append(cardTemp);

  // //! Wind readout:
  let cardWind = document.createElement("p");
  cardWind.setAttribute('class', "card-text");
  cardWind.textContent = "Wind speed: " + day.wind_speed + "mph";
  cardTemp.append(cardWind);

  //! Humidity Readout

  let cardHumidity = document.createElement("p");
  cardHumidity.setAttribute('class', "card-text");
  cardHumidity.textContent = "Humidity: " + day.humidity + "%";
  cardWind.append(cardHumidity);

  return cardContainer;
  cardContainer.append(fiveDayEl)
};

init();

//! THE ONE BUTTON TO RULE THEM ALL
searchBtn.addEventListener("click", function(event) {
  let userCity = userInput.value.trim();
  
  if (!userInput.value) {
    alert("Please enter a valid city/location"); //todo: change alert to MODAL? 
    return;
  };
  //! push user's entry into global bucket (array)
  //TODO - create an IF CLAUSE to check entry against Search History
  searchHistoryBucket.push(userCity);
  userInput.value = "";

  fetchCoords(userCity);
  console.log(userCity);
  storeCities();
  showHistory();
});




// //write getUVColor function00
// //*COLOR CODING FOR 
//   //*  -favorable
//   //*   -moderate
//   //*    -severe
//   //*then return whatever the classs

// function getUVColor () {
//   if (//num is between whatever and etc) {return green;}
//   //then call function in the weather render to span over the uv index)
// }
