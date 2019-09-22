// const axios = require('axios');
//axios cdn in index.html



async function geocode(e){
    //prevent actual submission
    e.preventDefault();

    let location = document.getElementById('location-input').value;
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params:{
            address: location,
            key: 'AIzaSyDVvQRF9gTPMVHOKVWWRxOD9OSZ_ByO-IQ'
        }
    });
        //formatted address
        let formattedAddress = response.data.results[0].formatted_address;
        let formattedAddressOutput = `
        <ul class="list-group">
            <li class="list-group-item">${formattedAddress}</li>
        </ul>
        `;
        //address components
        let addressComponents = response.data.results[0].address_components;
        let addressComponentsOutput = `<ul class="list-group">`;
            for(let component in addressComponents){
                    addressComponentsOutput += `
                    <li class="list-group-item"><strong>${addressComponents[component].types[0]}</strong>
                    : ${addressComponents[component].long_name}
                    </li>
                    `;
            }
            addressComponentsOutput += '</ul>';
        //geometry
        let lat2 = response.data.results[0].geometry.location.lat;
        let lon2 = response.data.results[0].geometry.location.lng;
        let geometryOutput = `
        <h2>${formattedAddress}</h2>
        <ul class="list-group">
            <li class="list-group-item" id="lat2">${lat2}</li>
            <li class="list-group-item" id="lon2">${lon2}</li>
        </ul>
        `;
        document.getElementById('geometry').innerHTML = geometryOutput;
        document.getElementById('result-distance').innerHTML = '';
        // document.getElementById('address-components').innerHTML = addressComponentsOutput;
};


//get user latitude & longitude
function getUserInfo(){
    var startPos;
    const geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 100
    }
    const geoSuccess = function(position) {
        startPos = position;
        let lat1 = startPos.coords.latitude;
        let lon1 = startPos.coords.longitude;
        let output = `<h1>User location</h1>
        <ul class="list-group">
        <li class="list-group-item" id="lat1">${lat1}</li>
        <li class="list-group-item" id="lon1">${lon1}</li>
        </ul>`;
        document.getElementById('userInfo').innerHTML = output;
    };
    const geoError = error => {
        console.log('Error occurred. Error code: ' + error.code);
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
};

//calculate distance
function distance(unit) {
    let lat1 = document.getElementById('lat1').innerHTML;
    let lat2 = document.getElementById('lat2').innerHTML;
    let lon1 = document.getElementById('lon1').innerHTML;
    let lon2 = document.getElementById('lon2').innerHTML;

    let radlat1 = Math.PI * lat1/180
    let radlat2 = Math.PI * lat2/180
    let theta = lon1-lon2
    let radtheta = Math.PI * theta/180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    console.log(dist + " KM away");
    document.getElementById('result-distance').innerHTML = `
    <h2 class="card-title text-primary text-center">${dist} KM away</h2>`;
}

