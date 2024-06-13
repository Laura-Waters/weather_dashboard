// DEPENDENCIES 
const dashboardEl = $('#dashboard');
const formEl = $('#form');
const formInputEl = $('#formInput');
const submitButtonEl = $('#submit-button'); 
const searchHistoryEl = $('#search-history'); 

// grab the value of the search input 
// add the input into a cities array in local storage  
// display the local storage data in the search history sidebar 
// input the value into a direct geocoding api to get location coordinates 
// use those coordinates in the current weather api, display in first card
// use those coordinates in the 5 day forecast api, display data   

//FUNCTION 
// submit the city, send the city name to the getCoordinates function & the city name to the displaySearchHistory function 
const handleFormSubmit = function(event) {
    event.preventDefault();

    const city = formInputEl.val().trim();

    if (city) {
        getCoordinates(city);
        formInputEl.val('');
    } else {
        alert('Please enter a city.'); 
    }

    displaySearchHistory(city); 

}

const displaySearchHistory = function(city) {
    const cityCard = $('<div>')
        .addClass('card')
    const cityName = $('<p>').addClass('city-name').text(city);

    cityCard.append(cityName);
    searchHistoryEl.append(cityCard);  
}


// get the coordinates of the inputted city, put those coord. in an array, save the array to local storage, send them to the getWeatherData function 
const getCoordinates = function(city) {
    const apiCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=38792de29430a8d8e76d2b4c582a85ec`;


    fetch(apiCityUrl).then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                console.log(data);

                let coordinates = []; 
                
                for (let i=0; i < data.length; i++) {
                    const currentCity = data[i];
                    const lat = currentCity.lat; 
                    const lon = currentCity.lon;
                    coordinates.push(lat, lon); 
                    localStorage.setItem('coordinates', JSON.stringify(coordinates));
                  }
                
                getWeatherData(coordinates); 
                fiveDayForecast(coordinates); 
            });
        } else {
            alert('Error'); 
        }
    })

    .catch(function (error) {
        alert('Unable to connect'); 
    })

}; 


const getWeatherData = function(coordinates) {
    const storedCoordinates = JSON.parse(localStorage.getItem('coordinates'));
    console.log(storedCoordinates);
    const apiCurrentForecastUrl = `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${storedCoordinates[0]}&lon=${storedCoordinates[1]}&appid=38792de29430a8d8e76d2b4c582a85ec`;


    fetch(apiCurrentForecastUrl).then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                console.log(data); 
                localStorage.setItem('current-weather', JSON.stringify(data));
                displayCurrentWeather(data); 
            })

        } else {
            alert('Error');
        }
    })

    .catch(function (error) {
        alert('Unable to connect'); 
    })

}; 


const displayCurrentWeather = function(data) {
    const currentWeather = JSON.parse(localStorage.getItem('current-weather')); 
    
    const currentWeatherCard = $('<div>').addClass('current-weather-card'); 
    const cardHeader = $('<h2>').addClass('card-header').text(currentWeather.name);
    const cardContent = $('<p>').addClass('card-content').text(`Temp: ${currentWeather.main.temp}\u00B0F \nWind: ${currentWeather.wind.speed}MPH \nHumidity: ${currentWeather.main.humidity}%`); 

    currentWeatherCard.append(cardHeader, cardContent);
    dashboardEl.append(currentWeatherCard); 

}



const fiveDayForecast = function(coordinates) {
    const storedCoordinates = JSON.parse(localStorage.getItem('coordinates'));
    var express = require('express');
    var cors = require('cors');
    var app = express();
    
    app.use(cors({origin:true, credentials:true})); 
    const apiFiveDayUrl = `api.openweathermap.org/data/2.5/forecast?lat=${storedCoordinates[0]}&lon=${storedCoordinates[1]}&appid=62586f440e3d8e4a5c064977738f344f`;

    fetch(apiFiveDayUrl).then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                console.log(data); 
                localStorage.setItem('five-day-forecast', JSON.stringify(data));
                displayFiveDayForecast(data); 
            })
        } else {
            alert('Error');
        }
    })

    .catch(function (error) {
        alert('Unable to connect'); 
    })
}

const displayFiveDayForecast = function(coordinates) {
    const fiveDayForecast = JSON.parse(localStorage.getItem('five-day-forecast')); 

    const fiveDayCards = $('<div>').addClass('five-day-cards');
    const dayOne = $('<div>').addClass('day-one'); 
    const dayTwo = $('<div>').addClass('day-two'); 
    const dayThree = $('<div>').addClass('day-three'); 
    const dayFour = $('<div>').addClass('day-four'); 
    const dayFive = $('<div>').addClass('day-five'); 
    const headerOne = $('<h4>').addClass('header-one');
    const headerTwo = $('<h4>').addClass('header-two');
    const headerThree = $('<h4>').addClass('header-three');
    const headerFour = $('<h4>').addClass('header-four');
    const headerFive = $('<h4>').addClass('header-five'); 
    const weatherOne = $('<p>').addClass('weather-one'); 
    const weatherTwo = $('<p>').addClass('weather-two'); 
    const weatherThree = $('<p>').addClass('weather-three'); 
    const weatherFour = $('<p>').addClass('weather-four'); 
    const weatherFive = $('<p>').addClass('weather-five');

    dayOne.append(headerOne, weatherOne); 
    dayTwo.append(headerTwo, weatherTwo);
    dayThree.append(headerThree, weatherThree);
    dayFour.append(headerFour, weatherFour); 
    dayFive.append(headerFive, weatherFive); 
    fiveDayCards.append(dayOne, dayTwo, dayThree, dayFour, dayFive); 
   



}

// USER INTERACTIONS 
formEl.on('submit', handleFormSubmit); 

