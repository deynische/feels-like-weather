// CORS error workaround
var url = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + config.DARKSKY_KEY;

window.onload = function() {
    // nab html elements
    var displayTitle = document.getElementById('weather');
    var displayInfo = document.getElementById('displayInfo');

    // check for geolocation
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position){
            // call Dark Sky API using geolocation
            url += '/' + position.coords.latitude + ',' + position.coords.longitude;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    displayInfo.innerHTML = data.currently.apparentTemperature + ' &deg;F';
                    displayTitle.innerHTML = '';
                })
                .catch(error => console.error(error))
        });
    } else {
    
    };
};