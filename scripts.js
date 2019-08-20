window.onload = function() {
    var displayInfo = document.getElementById('displayInfo');
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position){
            var getData = position.coords.latitude + ' ' + position.coords.longitude;
            displayInfo.append(getData);
        });
    } else {
    
    };
};