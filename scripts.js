// CORS proxy server workaround
var fccWeather = 'https://cors-anywhere.herokuapp.com/https://fcc-weather-api.glitch.me/api/current?';
var darksky = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/';
var geocode = 'https://api.opencagedata.com/geocode/v1/json?q=';
// background images
var img_bg = ['img/clear-day.jpg','img/clear-night.jpg','img/cloudy.jpg',
              'img/fog.jpg','img/partly-cloudy-day.jpg','img/partly-cloudy-night.jpg',
              'img/rain.jpg','img/sleet.jpg','img/snow.jpg','img/wind.jpg'];

window.onload = function() {
    // html elements
    var pageTitle = document.getElementsByTagName('h1');
    var displayTitle = document.getElementById('weather');
    var displayInfo = document.getElementById('displayInfo');
    var Fbtn = document.getElementById('degF');
    var Cbtn = document.getElementById('degC');
    var pageFoot = document.getElementsByTagName('footer');
    // data displays
    var displayLoc = createElement('span','','class','location');
    pageTitle[0].prepend(displayLoc);
    var displayFoot = createElement('span','');
    pageFoot[0].prepend(displayFoot);
    // store coordinates
    var lat, lng = '';
    // store raw temp data for conversion
    var tempData = {'current':'','high':'','low':'','unit':''};
    // unit state
    var unit = '';
    // listen for unit change
    Fbtn.addEventListener('change',convertTemp);
    Cbtn.addEventListener('change',convertTemp);

    // check for API keys
    if (typeof(config) != 'undefined'){
        // update footer info
        displayFoot.innerHTML = '<a href="https://darksky.net">Dark Sky API</a> & <a href="https://opencagedata.com/">OpenCage Geocoder</a>';
        // grab location from browser
        if ('geolocation' in navigator){
            // update coords
            navigator.geolocation.getCurrentPosition(function(position){
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                // call OpenCage API for geocoding
            fetch(geocode+lat+'+'+lng+'&key='+config.OPENCAGE_KEY)
                .then(response => response.json())
                .then(data => {
                    // update location display
                    displayLoc.innerHTML = data.results[0].components.city+', '+data.results[0].components.state_code;
                })
                .catch(error => console.error(error));
            // get API data
            fetch(darksky+config.DARKSKY_KEY+'/'+lat+','+lng+'?units=auto')
                .then(response => response.json())
                .then(data => {
                    // set unit state
                    tempData.unit = data.flags.units;
                    unit = data.flags.units;
                    updateBtn(unit);
                    // store raw temp data
                    tempData.current = data.currently.apparentTemperature;
                    tempData.high = data.daily.data[0].temperatureHigh;
                    tempData.low = data.daily.data[0].temperatureLow;
                    // update background img
                    updateImg(data.currently.icon);
                    // build display output
                    var current = createElement('p',Math.round(tempData.current),'class','temp current');
                    var forecast = createElement('p',data.currently.summary,'class','forecast');
                    var wrapper = createElement('div','','class','wrapper');
                    var hi = createElement('span',Math.round(tempData.high),'class','temp');
                    var lo = createElement('span',Math.round(tempData.low),'class','temp');
                    var rh = createElement('p','RH '+Math.round(data.currently.humidity*100)+'%');
                    var hiLabel = createElement('p','H ');
                    var loLabel = createElement('p','L ');
                    hiLabel.append(hi);
                    loLabel.append(lo);
                    wrapper.append(hiLabel,loLabel,rh);
                    displayInfo.append(current,forecast,wrapper);
                    displayTitle.innerHTML = '';
                })
                .catch(error => console.error(error));
            });
        } else {
            // no geolocation, dark sky & open cage API
        }
    } else {
        // run FCC weather API wrapper
        // update footer info
        displayFoot.innerHTML = '<a href="https://fcc-weather-api.glitch.me/">FCC Weather API Pass-Through</a>'
        if ('geolocation' in navigator){
            // update coords
            navigator.geolocation.getCurrentPosition(function(position){
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                // get API data
                fetch(fccWeather+'lat='+lat+'&lon='+lng)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        // default unit is C
                        tempData.unit = 'si';
                        unit = 'si';
                        updateBtn(unit);
                        // store raw temp data
                        tempData.current = data.main.temp;
                        tempData.high = data.main.temp_max;
                        tempData.low = data.main.temp_min;
                        // update background img based on forecast text
                        //updateImg(data.currently.icon);
                        // update location display
                        displayLoc.innerHTML = data.name+', '+data.sys.country;
                        // build display output
                        var current = createElement('p',Math.round(tempData.current),'class','temp current');
                        var forecast = createElement('p',data.weather[0].main,'class','forecast');
                        var wrapper = createElement('div','','class','wrapper');
                        var hi = createElement('span',Math.round(tempData.high),'class','temp');
                        var lo = createElement('span',Math.round(tempData.low),'class','temp');
                        var rh = createElement('p','RH '+Math.round(data.main.humidity)+'%');
                        var hiLabel = createElement('p','H ');
                        var loLabel = createElement('p','L ');
                        hiLabel.append(hi);
                        loLabel.append(lo);
                        wrapper.append(hiLabel,loLabel,rh);
                        displayInfo.append(current,forecast,wrapper);
                        displayTitle.innerHTML = '';
                    })
                    .catch(error => console.error(error));
            });
        } else {
            // display error message
        }
    }
    
    // temp unit functions
    function updateBtn(state){
        if (state == 'us'){
            Fbtn.checked = true;
        } else if (state == 'si'){
            Cbtn.checked = true;
        }
    }
    function convertTemp(e){
        // grab current html state
        unit = e.target.value;
        var arrayHTML = Array.from(document.getElementsByClassName('temp'));
        // grab keys to cycle through raw data
        var key = Object.keys(tempData);
        // compare units and convert temp as needed
        if (unit == tempData.unit){
            var k = 0;
            arrayHTML.forEach(function(o){
                o.innerHTML = Math.round(tempData[key[k]]);
                k++;
            });
        } else if (unit == 'us' && tempData.unit == 'si'){
            var k = 0;
            arrayHTML.forEach(function(o){
                o.innerHTML = toF(tempData[key[k]]);
                k++;
            });
        } else if (unit == 'si' && tempData.unit == 'us'){
            var k = 0;
            arrayHTML.forEach(function(o){
                o.innerHTML = toC(tempData[key[k]]);
                k++;
            });
        }
    }
    // set background image based on Dark Sky icon data
    function updateImg(dsIcon){
        document.body.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.0)), url(img/'+dsIcon+'.jpg)';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundSize = 'cover';
    }
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
// unit conversion
function toF(n){
    return Math.round((n*(9/5))+32);
}
function toC(n){
    return Math.round((n-32)*(5/9));
}