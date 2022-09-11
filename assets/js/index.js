let userQuery = document.getElementById("user-input");

// function renderWeather(weather) {
//   let results = document.getElementById("results-section");
//   //* show CITY NAME, DATE, WEATHER ICON, TEMP, WIND, HUMIDITY, and UV INDEX with COLOR CODED reference
//   let city = document.createElement("h2");
//   city.textContent =  
// }

//* BELOW - a function to fetch weather for a particular city
function fetchWeather(query) {
  let url = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=32f1cece631ee89046fe3328471647a0";

  fetch(url)
  .then((response) => response.json())
  .then((data) => console.log(data));
}
fetchWeather()




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

//   if(!searchInput.value){
//     return;
//   }
//   let city = searchInput.value.trim();
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