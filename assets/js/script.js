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
        formInputEl.val = '';
    } else {
        alert('Please enter a city.'); 
    }
}

const getCoordinates = function(city) {
    const apiCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=38792de29430a8d8e76d2b4c582a85ec`;

    fetch(apiCityUrl).then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                console.log(data);
                getWeatherData(); 
            });
        } else {
            alert('Error'); 
        }
    })

    .catch(function (error) {
        alert('Unable to connect'); 
    })
}; 

const getWeatherData = function() {

}; 

// USER INTERACTIONS 
formEl.on('submit', handleFormSubmit); 