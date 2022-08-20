var ORIGIN;
var DESTINATION;
const LABELS = "ABCD";
const TRAVELTRANS = {"セグウェイ": "DRIVING","竹馬": "WALKING", "かご": "BICYCLING", "プテラノドン": "PUTERANODON"};
const WAYPOINTS = {
    "セグウェイ": [{}],
    "竹馬": [{ location: "レントオールエドガワ"}],
    "かご": [{ location: "東京駅"}],
    "プテラノドン": [{ location: "東京駅"}],
};
const Speeds = {"セグウェイ": 20,"竹馬": 2, "かご": 7, "プテラノドン": 40};

var directionsService;
var directionsRenderer;
//objects
var map;
var lines;
var markers = [];

const MapUpdateDOM = document.querySelectorAll(".update");
const OriginDOM = document.querySelector("#origin");
const DestinationDOM = document.querySelector("#destination");
const MeansDOM = document.querySelector("#means");
const MinitusDOM = document.querySelector("#minutes");
var originGEO;
var destinationGEO;

var geocoder;

function initMap() {
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    lines = null;

    var mapOptions = {
      zoom:15,
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);
    ORIGIN = OriginDOM.innerHTML
    DESTINATION = DestinationDOM.innerHTML;
    // if(ORIGIN=="現在地"){
    //     positionMap();
    // }else{
    // }
    codeAddress1(ORIGIN);
    codeAddress2(DESTINATION);
    calcRoute("セグウェイ");
    // getPanorama(map);
    
}

function calcRoute(viecle) {
    resetDirections();
    const {waypoints, transitOptions} = routeSetting(viecle);
    var request = {
        origin: ORIGIN,
        destination: DESTINATION,
        travelMode: TRAVELTRANS[viecle],
        // waypoints,
        // transitOptions
        };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            const {routes} = result;
            const LatLngs = routes[0].legs[0].distance
            let sec = 1.0*LatLngs.value / Speeds[viecle];

            time = convertSecToTime(sec);
            MinitusDOM.innerHTML = time;
            MeansDOM.innerHTML = viecle;
            directionsRenderer.setDirections(result);
            directionsRenderer.setMap(map);
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
    OriginDOM.innerHTML = params.get("origin");
    DestinationDOM.innerHTML = params.get("destination");


}


MapUpdateDOM.forEach(element => {
    element.addEventListener("click", (e) =>{
        e.preventDefault();
        console.log(e.target.parentElement);
        const viecle = e.target.parentElement.dataset.viecle;
        if(viecle=="プテラノドン"){
            calcPutera(viecle);
        }else{
            calcRoute(viecle);
        }
    }); 
});

function getPanorama(map) {
    const fenway = { lat: 42.345573, lng: -71.098326 };

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

getOriginDest();

function codeAddress1(address, geo){
    var op = geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            var ll = results[0].geometry.location;
            glat = ll.lat();
            glng = ll.lng();
            originGEO = {"lat": glat, "lng": glng};

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

function codeAddress2(address){
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        var ll = results[0].geometry.location;
        var glat = ll.lat();
        var glng = ll.lng();
        destinationGEO = {"lat": glat, "lng": glng};
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}


function calcPutera(viecle){
    resetDirections();
    var pos = [
            originGEO,
            destinationGEO
        ];

	for(i=0;i<pos.length;i++){
		markers.push(new google.maps.Marker({
			position: pos[i],
			map: map,
			draggable: false,
            label :{
                color: '#FFFFFF',
                text: LABELS[i]
            }
		}));
	}
    console.log(pos);

	// 線を引く
	lines = new google.maps.Polyline({
		path: pos,
		strokeColor: "#0067c0",
		strokeOpacity: .7,
		strokeWeight: 7
	});

	lines.setMap(map);	

    let dist = google.maps.geometry.spherical.computeLength(
        [
        new google.maps.LatLng(originGEO["lat"], originGEO["lng"]),
        new google.maps.LatLng(destinationGEO["lat"], destinationGEO["lng"])
        ]
    );
    let sec = 1.0 + dist / Speeds[viecle];
    MinitusDOM.innerHTML = time;
    MeansDOM.innerHTML = viecle;
};

function resetDirections(){
    if(directionsRenderer != null){
        directionsRenderer.setMap(null);
    }
    if(lines != null){
        lines.setMap(null);	
    }
    markers.forEach((marker)=> {
        marker.setMap(null);
    });
    markers = [];
}


function convertSecToTime(sec){
    let day = Math.floor(sec / 86400);
    let hour = Math.floor(sec % 86400 / 3600);
    let min = Math.floor(sec % 3600 / 60);
    let rem = sec % 60;
    
    console.log(`${day}日${hour}時間${min}分${rem}秒`);
    time = `${min}分`;
    if (hour != 0 ) time = `${hour}時間` + time;
    if (day != 0 ) time = `${day}時間` + time;
    return time;
}

// function positionMap() {

//     navigator.geolocation.getCurrentPosition(function(position) {
//         // 緯度経度の取得
//         console.log(position);
//         let glat = position.coords.latitude;
//         let glng = position.coords.longitude;
//         originGEO = {"lat": glat, "lng": glng};
//         let latlng = new google.maps.LatLng(glat, glng);
//         geocoder.geocode( { 'latLng': latlng}, function(results, status) {
//             if (status == 'OK') {
//               var ll = results[0].geometry.location;
//             //   console.log(results[0].formatted_address);
//               ORIGIN = results[0].formatted_address;

//             } else {
//               alert('Geocode was not successful for the following reason: ' + status);
//             }
//           });
//         // latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

//     }, function() {
//         alert('位置情報取得に失敗しました');
//     });
// }

