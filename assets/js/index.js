let userInput = document.querySelector("#user-input");
let searchBtn = document.querySelector("#search-btn");

let apiKey = "32f1cece631ee89046fe3328471647a0";

let searchHistEl = document.querySelector("#search-history");
// let fiveDay = document.querySelector("#five-day");

const searchHistoryBucket = [];


function getCity(){
  let userCity = userInput.value;
  

  if (!userInput.value) {
    alert("Please enter a valid city/location");
    return;
  }

  if (!localStorage.getItem("userCity")) {
    localStorage.setItem("Location", "[]");
  } else {
    searchHistoryBucket = JSON.parse(localStorage.getItem("Location"));
  }

  if (searchHistoryBucket.length >=6) {
    searchHistoryBucket.pop();
  }





  fetchCoords(userCity);
  console.log(userCity);
  //todo : Most likely will have to set local storage here. setItem and CHECK to see if the entry is in the history list (if statement)
};


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

  function fetchWeather(lat, lon) {
    console.log("The coordinates are latitude:", lat, " and longitude:", lon);
  
    let url = "https://pro.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
  
    fetch(url)
    .then((response) => response.json())
    .then((data) => renderWeather(data));
  };
  
  function renderWeather(weather) {
    console.log(weather);
  
    let results = document.querySelector("#main-display");
    let fiveDay = document.querySelector("#five-day");
    let unixTimestamp = weather.current.dt*1000;
    let day = (new Date(unixTimestamp).toDateString()); 
    
    
    let weatherDetails = weather.current.weather[0];
    
    let cityInput = document.createElement("h2");
    cityInput.innerHTML =  city + ' ' + "(" + day +")";
    results.append(cityInput);
  
    let weatherImg = document.createElement("img");
    weatherImg.setAttribute("src", ("http://openweathermap.org/img/wn/" + weatherDetails.icon + ".png"));
    cityInput.appendChild(weatherImg);
  
    let temp = document.createElement("p");
    temp.textContent = "Temp: " + weather.current.temp + " °F";
    results.append(temp);
  
    let wind = document.createElement("p");
    wind.textContent = "Wind Speed: " + weather.current.wind_speed + " mph";
    results.append(wind);

    let humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + weather.current.humidity + "%";
    results.append(humidity);
  
    let uvIndex = document.createElement("p");
    uvIndex.innerHTML = "UV Index: " + weather.current.uvi;
    results.append(uvIndex);

    }
}

//write getUVColor function









// THEN I am presented with current and future conditions for that city and that city is added to the search history
//*LOCAL STORAGE





// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
//*COLOR CODING FOR 
  //*  -favorable
  //*   -moderate
  //*    -severe


// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
//* five day forecast with
  //* DATE
  //*  //* DATE, 
    //* WEATHER CONDITION ICONS, 
    //* TEMPERATURE, 
    //* HUMIDITY, 
    //* WIND SPEED, 
    //* ALL REPEATS FROM BEFORE EXCEPT UV INDEX


// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// function handleSearchSubmit(event){
//   event.preventDefault();
//   console.log('submit=clicked');
//todo : GET local storage and populate SEARCH HISTORY. Make history elements clickable to feed into fetchCoords
// function getLocalStorage(){
//   
//   
//   if (savedCities === !null) {
//     historyArray(push(savedCities));
//    //! RUN A FOR LOOP HERE TO ITERATE THROUGH LOCAL STORAGE AND POPULATE HISTORY BLOCK
//   }


//   if(!userInput.value){
//     return;
//   }
//   let city = userInput.value.trim();
//   console.log(city);
//   fetchCoords(city);
//   // to be done later
// };


// function handleSearchHistory(event){
//   event.preventDefault();
//   console.log('history=clicked')
// };

// searchForm.addEventListener('submit', handleSearchSubmit);
// history.addEventListener('click', handleSearchHistory);



// *make fetch call from coords, add filters for specific details; api key fed into url search.

// * console.log(data)  - look for lat and long. store in variables and pass along as needed

// * call another api with all details (use proven version 2.5) for temp, 5 day, et al

// *dynamically create elements in Search History (add text content of city name) and APPEND to search history

// * store city names in Local Storage

//! FIRST FUNCTION to DISPLAY weather results to the upper right grid (the user's search result)

//*  a UNIX timestamp converter, as we'll get the timestamp from the weather API. The precise time will be a ref to the weather api's own data pull, but all we are after is the date
//TODO try to convert to mockup format = (9/10/23)

//* create let to more easily append to main display
//*an easier way to access the weather[array] to get description and icons
// * creating, adding content, and appending CITY NAME, DATE, WEATHER ICON, TEMP, WIND, HUMIDITY, and UV INDEX with COLOR CODED reference to the main-display
