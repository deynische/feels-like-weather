// CORS proxy server workaround for Dark Sky API
var url = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + config.DARKSKY_KEY;
// temp unit state
var temp = ''

window.onload = function() {
    // html elements
    var displayTitle = document.getElementById('weather');
    var displayInfo = document.getElementById('displayInfo');
    var Fbtn = document.getElementById('degF');
    var Cbtn = document.getElementById('degC');
    // event listeners
    Fbtn.addEventListener('click',updateTemp);
    Cbtn.addEventListener('click',updateTemp);

    // check for geolocation
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position){
            // call Dark Sky API using geolocation
            url += '/'+position.coords.latitude+','+position.coords.longitude+'?units=auto';
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // set temp unit state
                    temp = data.flags.units;
                    updateBtn(temp);
                    // build display output
                    var ambient = createElement('p',data.currently.apparentTemperature,'class','temp ambient');
                    var forecast = createElement('p',data.currently.summary,'class','forecast');
                    var wrapper = createElement('div','','class','wrapper');
                    var hi = createElement('span',data.daily.data[0].temperatureHigh,'class','temp');
                    var lo = createElement('span',data.daily.data[0].temperatureLow,'class','temp');
                    var rh = createElement('p','RH '+(data.currently.humidity*100)+'%');
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
    function updateTemp(e){
        temp = e.target.value;
        var array = document.getElementsByClassName('temp');
        console.log(array);
        // cycle through all items with class temp and convert value to new temp unit
        if (temp == 'SI') {
            
        } else if (temp == 'US') {
    
        }
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