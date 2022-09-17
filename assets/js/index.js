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
let searchHistoryBucket = [] 

//* FUNCTION to run at PAGELOAD, call at end of index.js
function init() {
  let storedCities = JSON.parse(localStorage.getItem("Loc."));
  console.log(storedCities)
  // if local storage isn't empty, update bucket with stored entries
  if (storedCities !== null) {
    searchHistoryBucket = storedCities; 
  };
  showHistory();
};

//* FUNCTION to get items from Search History Bucket (e.g. local storage) and populate searchHistEl's
function showHistory() {
  searchHistEl.innerHTML = "";
  for (var i=0; i < searchHistoryBucket.length; i++) {
  let historyBtn = document.createElement("button");
  historyBtn.setAttribute("class", "history-btn border-0 rounded w-100 bg-dark text-white p-1 m-1")
  historyBtn.innerHTML = searchHistoryBucket [i];
  searchHistEl.appendChild(historyBtn);
  }
};

//* FUNCTION to store User Entries in local storage
function storeCities() {
  localStorage.setItem("Loc.", JSON.stringify(searchHistoryBucket))
}

//* FUNCTION to feed user's city into query and fetch geographic longitude and latitude.  Note: this API is convenient in that you can search by city name, but the response data is limited; hence the need for the fetchWeather METHOD (below)
function fetchCoords(city) {
  let userQueryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;

  fetch(userQueryUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (coords) {
    let lat = coords[0].lat;
    let lon = coords[0].lon;
    fetchWeather(lat, lon);  //! ADD A CONDITIONAL HERE TO DEAL WITH INVALID INPUT?
  });

  //* METHOD to feed previous API's City coordinates into "data-rich" API. Note: this is a workaround for the "data-rich" API requiring long. and lat. coordinates to search for unique weather locations.
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
    results.setAttribute('class', "border border-2 border-dark bg-primary text-light");
    

    //*  a UNIX TIMESTAMP CONVERTER to take unix value from API and convert it to a readable format
    let unixTimestamp = weather.current.dt*1000;
    let day = (new Date(unixTimestamp).toDateString()); 
    
    //* shortcut to weather array details
    let weatherDetails = weather.current.weather[0];

    if (results !== null) {
      results.innerHTML = "";
    }

    //* Items below to populate current weather in "results" div 
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

    //* FOR LOOP set to i=1, as we are looking for the next 5 days of weather for our cards.
    for (let i = 1; i < 6; i++) {
      let currentDay = weather.daily[i];
      makeFiveDay(currentDay);
      }
  };
};
// console.log(makeFiveDay());

// //* FUNCTION to create FIVE DAY forecast cards. Attribute details pulled directly from bootstrap cards. 
function makeFiveDay(day) {
  console.log(day);
  fiveDayHeader.style.display = "";
  let date = (new Date(day.dt*1000).toDateString()); 
  console.log(date);


  let cardContainer = document.createElement("div");
  cardContainer.setAttribute('class', "card bg-primary col m-1");
  cardContainer.style.width = '15rem';
  fiveDayEl.append(cardContainer);


  let cardBody = document.createElement("div");
  cardBody.setAttribute('class', "card-body");
  cardContainer.append(cardBody);


  //* Card Title (our future day DATE)
  let cardTitle = document.createElement("h6");
  cardTitle.setAttribute('class', "card-title");
  cardTitle.textContent = date;
  cardBody.append(cardTitle);
  
  //* Descriptive weather Icon
  //todo GET ICON TO ALWAYS SET AT END OF TITLE(DATE) maybe pseudo? float?
  let cardIcon = document.createElement("img");
  cardIcon.setAttribute("src", ("http://openweathermap.org/img/wn/" + day.weather[0].icon + ".png"));
  cardTitle.append(cardIcon);


  //* Temperature readout:
  let cardTemp = document.createElement("p");
  cardTemp.setAttribute('class', "card-text");
  cardTemp.textContent = "Temp: " + day.temp.max;
  console.log(day.temp.max);
  cardBody.append(cardTemp);

  //* Wind readout:
  let cardWind = document.createElement("p");
  cardWind.setAttribute('class', "card-text");
  cardWind.textContent = "Wind: " + day.wind_speed + "mph";
  cardBody.append(cardWind);

  //* Humidity Readout
  let cardHumidity = document.createElement("p");
  cardHumidity.setAttribute('class', "card-text");
  cardHumidity.textContent = "Humidity: " + day.humidity + "%";
  cardBody.append(cardHumidity);

  return cardContainer;
  cardContainer.append(fiveDayEl)
};

init();

//* THE ONE BUTTON TO RULE THEM ALL
searchBtn.addEventListener("click", function(event) {
  let userCity = userInput.value.trim();
  
  if (!userInput.value) {
    alert("Please enter a valid city/location"); //todo: change alert to MODAL? 
    return;
  };
  //* push user's entry into global bucket (array)
  //TODO - create an IF CLAUSE to check entry against Search History
  searchHistoryBucket.push(userCity);
  userInput.value = "";

  fetchCoords(userCity);
  console.log(userCity);
  storeCities();
  showHistory();
});

searchHistEl.addEventListener('click', function(event){
  let element = event.target;
  if (element.matches(".history-btn")){
    fetchCoords(element.textContent);
  }
})


//todo BUILD COLOR CODING FUNCTION
// //write getUVColor function00
// // //*COLOR CODING FOR 
// //   //*  -favorable
// //   //*   -moderate
// //   //*    -severe
// //   //*then return whatever the classs

// function getUVColor () {
//   if 
  
  
//   //num is between whatever and etc) {return green;}
//   //then call function in the weather render to span over the uv index)
// }


//todo variables all set?
//todo selectors all set?

//todo CHANGE ALERT MESSAGE TO TEXT CONTENT THAT WILL UPDATE UPON EMPTY SEARCH ENTRY AND INVALID LOCATION NAME (BONUS)
//TODO 