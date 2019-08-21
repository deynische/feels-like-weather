// CORS proxy server workaround for Dark Sky API
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
                    console.log(data);
                    var ambient = createElement('p',data.currently.apparentTemperature+'&deg;F','class','ambient');
                    var forecast = createElement('p',data.currently.summary,'class','forecast');
                    var wrapper = createElement('div','','class','wrapper');
                    var hi = createElement('p','H '+data.daily.data[0].temperatureHigh+'&deg;');
                    var lo = createElement('p','L '+data.daily.data[0].temperatureLow+'&deg;');
                    var rh = createElement('p','RH '+(data.currently.humidity*100)+'%');
                    wrapper.append(hi,lo,rh);
                    displayInfo.append(ambient,forecast,wrapper);
                    displayTitle.innerHTML = '';
                })
                .catch(error => console.error(error))
        });
    } else {
    
    };
};

// helper functions
function createElement(el,content,attr,attrValue){
    var newEl = document.createElement(el);
    newEl.innerHTML = content;
    if (attr){
        newEl.setAttribute(attr,attrValue);
    }
    return newEl;
}