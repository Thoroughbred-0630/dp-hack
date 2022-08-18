const FROM = "埼玉県坂戸市";
const TO = "東京タワー"

function initMap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var tokyo = new google.maps.LatLng(35.68142790470337, 139.7670604249919);
    var mapOptions = {
      zoom:15,
      center: tokyo
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);
    calcRoute(directionsService, directionsRenderer);
}

function calcRoute(directionsService, directionsRenderer) {
    // var start = document.getElementById('start').value;
    // var end = document.getElementById('end').value;
    var start = FROM;
    var end = TO;
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
        };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            const {routes} = result;
            const LatLngs = routes[0].legs[0].distance
            console.log(LatLngs);
            console.log(routes[0]);
        directionsRenderer.setDirections(result);
        }
    });
}



