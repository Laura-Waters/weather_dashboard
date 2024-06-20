// DEPENDENCIES 
const dashboardEl = $('#dashboard');
const formEl = $('#form');
const formInputEl = $('#formInput');
const submitButtonEl = $('#submit-button'); 
const searchHistoryEl = $('#search-history'); 
const fiveDayCardsEl = $('#five-day-forecast'); 

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
    dashboardEl.empty();
    const city = formInputEl.val().trim();

    if (city) {
        getCoordinates(city);
        formInputEl.val('');
    } else {
        alert('Please enter a city.'); 
        return;
    }

    displaySearchHistory(city); 

}

const displaySearchHistory = function(city) {
    const cityCard = $('<div>')
        .addClass('card city-button')
    const cityName = $('<p>').addClass('city-name').text(city);
    cityCard.css('cursor', 'pointer');

    cityCard.append(cityName);
    searchHistoryEl.append(cityCard);  
}


// get the coordinates of the inputted city, put those coord. in an array, save the array to local storage, send them to the getWeatherData function 
const getCoordinates = function(city) {
    const apiCityUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=38792de29430a8d8e76d2b4c582a85ec`;


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
    const currentWeatherCard = $('<div>').addClass('current-weather-card'); 
    const cardHeader = $('<h2>').addClass('card-header').text(data.name);
    const currentWeatherIcon = $('<div>').html(`<img id="current-icon" class="icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>`); 
    const cardContent = $('<p>').addClass('card-content').html(`<div></div> Temp: ${data.main.temp}\u00B0F <div class=lineOfText></div> Wind: ${data.wind.speed}MPH <div class=lineOfText></div> Humidity: ${data.main.humidity}%`); 

    cardHeader.append(currentWeatherIcon); 
    currentWeatherCard.append(cardHeader, cardContent);
    dashboardEl.append(currentWeatherCard);

}



const fiveDayForecast = function(coordinates) {
    const storedCoordinates = JSON.parse(localStorage.getItem('coordinates'));
   
    const apiFiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${storedCoordinates[0]}&lon=${storedCoordinates[1]}&appid=62586f440e3d8e4a5c064977738f344f`;

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

const displayFiveDayForecast = function() { 
    const localStorageWeather = (JSON.parse(localStorage.getItem('five-day-forecast')));
    console.log(localStorageWeather)
    const weatherArray = [localStorageWeather.list]; 


    for (dayWeather of weatherArray) {
        const dayOneArray = (dayWeather[8]); 
        const dayTwoArray = (dayWeather[16]);
        const dayThreeArray = (dayWeather[24]);
        const dayFourArray = (dayWeather[32]); 
        const dayFiveArray = (dayWeather[39]);

        console.log(dayOneArray);
        console.log(dayTwoArray); 

        const fiveDayForecastEl = $('<div>').addClass('forecast-container');
        dashboardEl.append(fiveDayForecastEl);

        /// DAY ONE
        const dayOneCard = $('<div>').addClass('five-cards'); 
        const dateOne = new Date(((dayOneArray.dt)*1000));
        const dayOneHeader = $('<h4>').addClass('day-header card-header').text(dateOne.toLocaleDateString('en-US'));
        const dayOneIcon = $('<div>').html(`<img class="icon" src="https://openweathermap.org/img/wn/${dayOneArray.weather[0].icon}@2x.png"/>`); 
        const dayOneContent = $('<p>').addClass('five-cards-content').html(`<div></div> Temp: ${dayOneArray.main.temp}\u00B0F <div class=lineOfText></div> Wind: ${dayOneArray.wind.speed}MPH <div class=lineOfText></div> Humidity: ${dayOneArray.main.humidity}%`)

        dayOneCard.append(dayOneHeader, dayOneIcon, dayOneContent); 
        fiveDayForecastEl.append(dayOneCard); 

        /// DAY TWO 
        const dayTwoCard = $('<div>').addClass('five-cards'); 
        const dateTwo = new Date(((dayTwoArray.dt)*1000));
        const dayTwoHeader = $('<h4>').addClass('day-header card-header').text(dateTwo.toLocaleDateString('en-US'));
        const dayTwoIcon = $('<div>').html(`<img class="icon" src="https://openweathermap.org/img/wn/${dayTwoArray.weather[0].icon}@2x.png"/>`); 
        const dayTwoContent = $('<p>').addClass('five-cards-content').html(`<div></div> Temp: ${dayTwoArray.main.temp}\u00B0F <div class=lineOfText></div> Wind: ${dayTwoArray.wind.speed}MPH <div class=lineOfText></div> Humidity: ${dayTwoArray.main.humidity}%`)
 
        dayTwoCard.append(dayTwoHeader, dayTwoIcon, dayTwoContent); 
        fiveDayForecastEl.append(dayTwoCard); 

        /// DAY THREE 
        const dayThreeCard = $('<div>').addClass('five-cards'); 
        const dateThree = new Date(((dayThreeArray.dt)*1000));
        const dayThreeHeader = $('<h4>').addClass('day-header card-header').text(dateThree.toLocaleDateString('en-US'));
        const dayThreeIcon = $('<div>').html(`<img class="icon" src="https://openweathermap.org/img/wn/${dayThreeArray.weather[0].icon}@2x.png"/>`); 
        const dayThreeContent = $('<p>').addClass('five-cards-content').html(`<div></div> Temp: ${dayThreeArray.main.temp}\u00B0F <div class=lineOfText></div> Wind: ${dayThreeArray.wind.speed}MPH <div class=lineOfText></div> Humidity: ${dayThreeArray.main.humidity}%`)
    
        dayThreeCard.append(dayThreeHeader, dayThreeIcon, dayThreeContent); 
        fiveDayForecastEl.append(dayThreeCard); 

        /// DAY FOUR 
        const dayFourCard = $('<div>').addClass('five-cards'); 
        const dateFour = new Date(((dayFourArray.dt)*1000));
        const dayFourHeader = $('<h4>').addClass('day-header card-header').text(dateFour.toLocaleDateString('en-US'));
        const dayFourIcon = $('<div>').html(`<img class="icon" src="https://openweathermap.org/img/wn/${dayFourArray.weather[0].icon}@2x.png"/>`); 
        const dayFourContent = $('<p>').addClass('five-cards-content').html(`<div></div> Temp: ${dayFourArray.main.temp}\u00B0F <div class=lineOfText></div> Wind: ${dayFourArray.wind.speed}MPH <div class=lineOfText></div> Humidity: ${dayFourArray.main.humidity}%`)
      
        dayFourCard.append(dayFourHeader, dayFourIcon, dayFourContent); 
        fiveDayForecastEl.append(dayFourCard); 

        /// DAY FIVE
        const dayFiveCard = $('<div>').addClass('five-cards'); 
        const dateFive = new Date(((dayFiveArray.dt)*1000));
        const dayFiveHeader = $('<h4>').addClass('day-header card-header').text(dateFive.toLocaleDateString('en-US'));
        const dayFiveIcon = $('<div>').html(`<img class="icon" src="https://openweathermap.org/img/wn/${dayFiveArray.weather[0].icon}@2x.png"/>`); 
        const dayFiveContent = $('<p>').addClass('five-cards-content').html(`<div></div> Temp: ${dayFiveArray.main.temp}\u00B0F <div class=lineOfText></div> Wind: ${dayFiveArray.wind.speed}MPH <div class=lineOfText></div> Humidity: ${dayFiveArray.main.humidity}%`)
      
        dayFiveCard.append(dayFiveHeader, dayFiveIcon, dayFiveContent); 
        fiveDayForecastEl.append(dayFiveCard); 
    } 

   
}


// USER INTERACTIONS 
formEl.on('submit', handleFormSubmit); 

searchHistoryEl.on('click', '.city-name', function() {
    dashboardEl.empty();
    getCoordinates($(this).text());
}); 

