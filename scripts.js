// CORS proxy server workaround for Dark Sky API
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
    // location display
    var displayLoc = createElement('span','','class','location');
    pageTitle[0].prepend(displayLoc);
    // store raw temp data for conversion
    var tempData = {'ambient':'','high':'','low':'','unit':''};
    // unit state
    var unit = '';
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
            fetch(darksky+config.DARKSKY_KEY+'/'+position.coords.latitude+','+position.coords.longitude+'?units=auto')
                .then(response => response.json())
                .then(data => {
                    // set unit state
                    tempData.unit = data.flags.units;
                    unit = data.flags.units;
                    updateBtn(unit);
                    // store raw temp data
                    tempData.ambient = data.currently.apparentTemperature;
                    tempData.high = data.daily.data[0].temperatureHigh;
                    tempData.low = data.daily.data[0].temperatureLow;
                    // update background img
                    updateImg(data.currently.icon);
                    // build display output
                    var ambient = createElement('p',Math.round(tempData.ambient),'class','temp ambient');
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