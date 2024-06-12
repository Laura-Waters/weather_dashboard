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
            })
        } else {
            alert('Error');
        }
    })

    .catch(function (error) {
        alert('Unable to connect'); 
    })
}; 

// USER INTERACTIONS 
formEl.on('submit', handleFormSubmit); 