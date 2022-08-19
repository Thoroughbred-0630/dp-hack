var FROM;
var TO;
//const FROM = "恵比寿駅";
//const TO = "東京タワー"
const TRAVELTRANS = {"セグウェイ": "DRIVING","竹馬": "WALKING", "かご": "WALKING", "プテラノドン": "PUTERANODON"};
const WAYPOINTS = {
    "セグウェイ": [{}],
    "竹馬": [{ location: "東京駅"}],
    "かご": [{ location: "東京駅"}],
    "プテラノドン": [{ location: "東京駅"}],
};
var TRAVELMODE = TRAVELTRANS["セグウェイ"];
var directionsService;
var directionsRenderer;
var map;
const MapUpdateDOM = document.querySelectorAll(".update");
const OriginDOM = document.querySelector("#origin");
const DestinationDOM = document.querySelector("#destination");

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    // var tokyo = new google.maps.LatLng(35.68142790470337, 139.7670604249919);
    var mapOptions = {
      zoom:15,
    //   center: tokyo
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);
    calcRoute();
    getPanorama(map);
    
    //sample
    new google.maps.Marker({
        position: { lat: 35.68142790470337, lng: 139.7670604249919 },
        map,
        title: "Hello World!",
      });
    
}

function calcRoute() {
    //reset map
    console.log("aaa");
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    // var start = FROM;
    //  console.log(start);
    // var end = TO;
    // console.log(end);
    //const {waypoints, transitOptions} = routeSetting();
    var request = {
        origin: OriginDOM.innerHTML,
        destination: DestinationDOM.innerHTML,
        travelMode: TRAVELMODE,
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
        TRAVELMODE = TRAVELTRANS[viecle];
        calcRoute();
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

const routeSetting = () =>{
    waypoints = WAYPOINTS[TRAVELMODE];
    transitOptions = {}
    return {
        waypoints: WAYPOINTS,
        transitOptions: transitOptions,
    };
};


//   window.initialize = initialize;
getOriginDest()

