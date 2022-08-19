var FROM;
var TO;
//const FROM = "恵比寿駅";
//const TO = "東京タワー"
const TRAVELTRANS = {"セグウェイ": "DRIVING","竹馬": "WALKING", "かご": "WALKING", "プテラノドン": "PUTERANODON"};
const WAYPOINTS = {
    "セグウェイ": [{}],
    "竹馬": [{ location: "レントオールエドガワ"}],
    "かご": [{ location: "東京駅"}],
    "プテラノドン": [{ location: "東京駅"}],
};
const Speeds = {"セグウェイ": 1,"竹馬": 10, "かご": 20, "プテラノドン": 30};
// var TRAVELMODE = TRAVELTRANS["セグウェイ"];
var directionsService;
var directionsRenderer;
var map;
const MapUpdateDOM = document.querySelectorAll(".update");
const OriginDOM = document.querySelector("#origin");
const DestinationDOM = document.querySelector("#destination");
const MeansDOM = document.querySelector("#means");
const MinitusDOM = document.querySelector("#minutes");


var geocoder;

function initMap() {
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    // var tokyo = new google.maps.LatLng(35.68142790470337, 139.7670604249919);
    var mapOptions = {
      zoom:15,
    //   center: tokyo
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);
    calcRoute("セグウェイ");
    // getPanorama(map);
    
    //sample
    new google.maps.Marker({
        position: { lat: 35.68142790470337, lng: 139.7670604249919 },
        map,
        title: "Hello World!",
      });
    
}

function calcRoute(viecle) {
    //reset map
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    // var start = FROM;
    //  console.log(start);
    // var end = TO;
    // console.log(end);
    const {waypoints, transitOptions} = routeSetting(viecle);
    var request = {
        origin: OriginDOM.innerHTML,
        destination: DestinationDOM.innerHTML,
        travelMode: TRAVELTRANS[viecle],
       // waypoints: waypoints,
       // transitOptions: transitOptions
        // transitOptions: {
        //     // departureTime: new Date(1337675679473),
        //     modes: ['TRAIN'],
        //     // routingPreference: 'FEWER_TRANSFERS'
        // },
        };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            const {routes} = result;
            const LatLngs = routes[0].legs[0].distance
            console.log(LatLngs);
            // console.log(routes[0]);
            console.log(routes[0]);
            let sec = 1.0*LatLngs.value / Speeds[viecle];

            let day = Math.floor(sec / 86400);
            let hour = Math.floor(sec % 86400 / 3600);
            let min = Math.floor(sec % 3600 / 60);
            let rem = sec % 60;
            
            console.log(`${day}日${hour}時間${min}分${rem}秒`);
            time = `${min}分`;
            if (hour != 0 ) time = `${hour}時間` + time;
            if (day != 0 ) time = `${day}時間` + time;
            MinitusDOM.innerHTML = time;
            MeansDOM.innerHTML = viecle;
            directionsRenderer.setDirections(result);
        }
    });
}


function getOriginDest() {
	// URLを取得
	const url = new URL(window.location.href);

	// URLSearchParamsオブジェクトを取得
	const params = url.searchParams;

	// consoleに受け取ったパラメータを出力
	//console.log(params);

	// パラメータから「origin」と「destination」を取得
	// start = params.get("origin");
	// console.log(start);
	// end = params.get("destination");
	// console.log(end);
    OriginDOM.innerHTML = params.get("origin");
    DestinationDOM.innerHTML = params.get("destination");

}


MapUpdateDOM.forEach(element => {
    element.addEventListener("click", (e) =>{
        e.preventDefault();
        const viecle = e.target.dataset.viecle;
        // TRAVELMODE = TRAVELTRANS[viecle];
        if(viecle=="プテラノドン"){
            calcPutera(viecle);
        }else{
            calcRoute(viecle);
        }
    }); 
});

function getPanorama(map) {
    const fenway = { lat: 42.345573, lng: -71.098326 };
    // const map = new google.maps.Map(document.getElementById("map"), {
    //   center: fenway,
    //   zoom: 14,
    // });
    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano"),
      {
        position: fenway,
        pov: {
          heading: 84,
          pitch: 50,
        },
      }
    );
    map.setStreetView(panorama);
}

const routeSetting = (viecle) =>{
    waypoints = WAYPOINTS[viecle];
    transitOptions = {}
    return {
        waypoints: waypoints,
        transitOptions: transitOptions,
    };
};


//   window.initialize = initialize;
getOriginDest();

const calcPutera = (viecle) => {
    // const dakota = {lat: 40.7767644, lng: -73.9761399};
    // const frick = {lat: 40.771209, lng: -73.9673991};
    const {lat, lng} = codeAddress(OriginDOM.innerHTML);
    // const {lat:blat, lng:blng} = codeAddress(DestinationDOM.innerHTML);
    // originA = {lat:originAddress.lat, lng:originAddress.lng};
    // originB = {lat:departAddress.lat, lng:departAddress.lng};
    console.log(lat);
    var pos = [
        new google.maps.LatLng(alat, alng),
        new google.maps.LatLng(blat, blng)
    ];
    var dist = google.maps.geometry.spherical.computeLength(pos);
    console.log("dist");
    console.log(dist);
    // var line =  new google.maps.Polyline({path: [originA, originB], map: map});
};


function codeAddress(address) {
    // var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {

        var ll = results[0].geometry.location;
        var glat = ll.lat();
        var glng = ll.lng();
        console.log(glng);

        // console.log(results[0]);
        return {
            lat: glat,
            lng: glng
        };
        // map.setCenter(results[0].geometry.location);
        // var marker = new google.maps.Marker({
        //     map: map,
        //     position: results[0].geometry.location
        // });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}