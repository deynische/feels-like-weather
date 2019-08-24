// CORS proxy server workaround for Dark Sky API
var url = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + config.DARKSKY_KEY;
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
    // location display
    var displayLoc = createElement('span','','class','location');
    pageTitle[0].prepend(displayLoc);
    // unit flag
    var unit = '';

    // store raw temp data for conversion

    // listen for unit change
    Fbtn.addEventListener('change',convertTemp);
    Cbtn.addEventListener('change',convertTemp);

    // check for geolocation
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position){
            // call OpenCage API for geocoding
            fetch(geocode+position.coords.latitude+'+'+position.coords.longitude+'&key='+config.OPENCAGE_KEY)
                .then(response => response.json())
                .then(data => {
                    // create if/then for: city/state, city/province, city/country
                    console.log(data);
                    displayLoc.innerHTML = data.results[0].components.city+', '+data.results[0].components.state_code;
                })
                .catch(error => console.error(error))
            // call Dark Sky API using geolocation
            url += '/'+position.coords.latitude+','+position.coords.longitude+'?units=auto';
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // set temp unit state
                    unit = data.flags.units;
                    updateBtn(unit);
                    // update background img
                    updateImg(data.currently.icon);
                    // build display output
                    var ambient = createElement('p',Math.round(data.currently.apparentTemperature),'class','temp ambient');
                    var forecast = createElement('p',data.currently.summary,'class','forecast');
                    var wrapper = createElement('div','','class','wrapper');
                    var hi = createElement('span',Math.round(data.daily.data[0].temperatureHigh),'class','temp');
                    var lo = createElement('span',Math.round(data.daily.data[0].temperatureLow),'class','temp');
                    var rh = createElement('p','RH '+Math.round(data.currently.humidity*100)+'%');
                    var hiLabel = createElement('p','H ');
                    var loLabel = createElement('p','L ');
                    hiLabel.append(hi);
                    loLabel.append(lo);
                    wrapper.append(hiLabel,loLabel,rh);
                    displayInfo.append(ambient,forecast,wrapper);
                    displayTitle.innerHTML = '';
                })
                .catch(error => console.error(error))
        });
    } else {
    
    };
    
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
        // cycle through and convert temp to new unit
        if (unit == 'SI') {
            arrayHTML.forEach(function(o){
                o.innerHTML = Math.round((o.innerHTML-32)*(5/9));
            });
        } else if (unit == 'US') {
            arrayHTML.forEach(function(o){
                o.innerHTML = Math.round((o.innerHTML*(9/5))+32);
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