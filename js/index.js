const mapStyle = [
    {
      "featureType": "administrative",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "lightness": 0
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#f2e5d4"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c5dac6"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c5c6c6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fbfaf7"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#acbcc9"
        }
      ]
    }
];

var map;
var markers = [];
var infoWindow;
var labelIndex = 0;


function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 8,
        styles: mapStyle
    });

    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

function searchStores(){
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
        stores.forEach(function(store){
          var postal = store.address.postalCode.substring(0,5);
          if (zipCode === postal){
              foundStores.push(store);
          }
    });
    }
    else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations(){
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}


function setOnClickListener() {
    console.log(markers);
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}

function displayStores(stores) {
    
    var storesHtml = "";

    stores.forEach(function(store, index){
        var address = store.addressLines;
        var phone = store.phoneNumber;
        // console.log(store);
        storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                    <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index + 1}
                        </div>
                    </div>
                </div>
            </div>
        `
    });
    document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function(store, index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude
        );
        var name = store.name;
        var address = store.addressLines[0];
        var phone =store.phoneNumber;
        var open = store.openStatusText;
        bounds.extend(latlng);

        createMarker(latlng, name, address, phone, open, index)
    });
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, phone, open, index) {
    // var iconBase = 'http://maps.google.com/mapfiles/kml/paddle/';
    var html =`
    <div class="window">
        <div class="name-open">
            <span class="name">${name} </span> 
            <span class="open">${open}</span>
        </div>
        <div class="info">
            <div class ="direction">
                <i class="far fa-compass"></i>
                <span class="nav"> <a href=" https://www.google.com/maps/dir/?api=1&destination=${address}"> ${address}</a></span>
            </div> </br>
            <div class="phone">
                <i class="fas fa-phone-alt"></i>
                <span class="phone">${phone}</span>
            </div>
        </div>      
    </div>     
    `;

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        // animation: google.maps.Animation.DROP,
        icon: {
          url: 'https://img.icons8.com/plasticine/100/000000/place-marker.png',
          scaledSize: new google.maps.Size(60, 60),
          labelOrigin: new google.maps.Point(30, 25),
        },
        label: {
          text: `${index + 1}`,
          color: 'black',
          fontSize: '12px',
          
        },
    });
    // marker.addListener('click', toggleBounce);

    // function toggleBounce() {
    //     if (marker.getAnimation() !== null) {
    //         marker.setAnimation(null);
    //     }
    //     else {
    //         marker.setAnimation(google.maps.Animation.BOUNCE);
    //         var label = this.getLabel();
    //         label.setAnimation(google.maps.Animation.BOUNCE);
    //         label.color = 'black';
    //         this.setLabel(label);
    //     }
    // }

    

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
  }

