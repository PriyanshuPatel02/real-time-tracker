const socket = io();  /// connection request jaati hai backend mein

// check if geoloc is supported by the browser
if(navigator.geolocation){
    // watch the user;s posn continuoussly
    navigator.geolocation.watchPosition(
        (position) =>{
            const {latitude, longitude} = position.coords;
            // emit the loca to the server
            socket.emit('send-location', {latitude, longitude});

        },

        (error) =>{  //log error that occur during geolocation
            console.error(error);
        },
        {
            enableHighAccuracy: true,  // req high accuracy
            maximumAge : 0, // dont use a cached position // abhi turant ka position chhaiye
            timeout: 5000 /// time to wait for a position in millisec
        }
    );
}

const map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution : "Priyanshu Patel"
}).addTo(map)


const markers = {};

socket.on('receive-location', (data) => {
    const {id, longitude, latitude } = data;  // ye sb data se bahar nikal liye destructuring krke
    map.setView([latitude, longitude]  );

    // marker ke pint ke liye
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);


    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// disconnect hua toh marker hatt jana chahiye
socket.on('user-disconnected', (id)=> {
     if(markers[id]){  // ab markers ki id remove kr denge
        map.removeLayer(markers[id]); 

        delete markers[id];
     }
})


