let userInput = document.querySelector("#user-input");
let searchBtn = document.querySelector("#search-btn");
let apiKey = "32f1cece631ee89046fe3328471647a0";
// let forecast = document.querySelector("#main-display");
let unixTimestamp = weather.coord.dt;

//TODO -add MOMENT.JS in order to add date to main display
//* send weather results to the main display (the user's search result)
function renderWeather(weather) {
  console.log(weather);
  //*to easily access the array of description data 
  let weatherDetails = weather.weather[0]; 

  //*Build a UNIX timestamp converter
  function timeConvert(unixTimestamp) {
    let date = new Date (unixTimestamp *1000); //*js works in milliseconds, converting to seconds
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let year = date.getFullYear();
    let month = months[date.getMonth()];
    
  }
  
  


//* show CITY NAME, DATE, WEATHER ICON, TEMP, WIND, HUMIDITY, and UV INDEX with COLOR CODED reference
  let results = document.querySelector("#main-display");
  
  let city = document.createElement("h2");
  city.textContent = weather.name; //*add date and weather icon
  results.append(city);

  let temp = document.createElement("p");
  temp.textContent = "Temp: " + weather.main.temp + " F°";
  results.append(temp);

  let wind = document.createElement("p");
  wind.textContent = "Wind Speed: " + weather.wind.speed + " mph";
  results.append(wind);

  let humidity = document.createElement("p");
  humidity.textContent = "Humidity: " + weather.main.humidity + "%";
  results.append(humidity);

  // let uvIndex = document.createElement("p");
  // uvIndex.textContent = "UV Index: " + weather.main.uvindex
  
};

//* BELOW - a function to fetch weather for a particular city
function fetchWeather(query) {
  let url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=32f1cece631ee89046fe3328471647a0";

  fetch(url)
  .then((response) => response.json())
  .then((data) => renderWeather(data));
}
fetchWeather("San Diego")


// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
//*city search. search BUTTON







// THEN I am presented with current and future conditions for that city and that city is added to the search history
//*LOCAL STORAGE


// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//*So, pull NAME, 
    //* DATE, 
    //* WEATHER CONDITION ICONS, 
    //* TEMPERATURE, 
    //* HUMIDITY, 
    //* WIND SPEED, 
    //* UV INDEX 


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

//   if(!userInput.value){
//     return;
//   }
//   let city = userInput.value.trim();
//   console.log(city);
//   fetchCoords(city);
//   // to be done later
// };

// //* get coordinates from api weather data for function
// function fetchCoords(city) {
//   console.log("fetchCoords city = ", city);
// }

// function handleSearchHistory(event){
//   event.preventDefault();
//   console.log('history=clicked')
// };

// searchForm.addEventListener('submit', handleSearchSubmit);
// history.addEventListener('click', handleSearchHistory);


//*make fetch call from coords, add filters for specific details; api key fed into url search.

//* console.log(data)  - look for lat and long. store in variables and pass along as needed

//* call another api with all details (use proven version 2.5) for temp, 5 day, et al

//*dynamically create elements in Search History (add text content of city name) and APPEND to search history

//* store city names in Local Storage