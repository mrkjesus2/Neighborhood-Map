app.Map = app.Map || {};

app.Map = {
  init: function() {
    this.infoWindow = new google.maps.InfoWindow;
    var home = {lat: 39.927677, lng: -75.171909};
    var el = document.getElementById('map-container');
    this.map = new google.maps.Map(el, {
      center: home,
      zoom: 15,
      minZoom: 12,
      maxZoom: 18
    });
    console.log('Map Initialized'); // REMOVE
    // Load places once the maps bounds are set
    google.maps.event.addListenerOnce(this.map, 'bounds_changed', this.getPlaces);
  },

  // Get a list of places from Google Maps and fill ViewModel places array
  getPlaces: function() {
    console.log('Getting Places'); // REMOVE

    var placesApi = new google.maps.places.PlacesService(app.Map.map);
    var request = {
      bounds: app.Map.map.getBounds(),
      types: ['restaurant']
    };

    placesApi.nearbySearch(request, function(results, status) {
      if (status === 'OK') {
        results.forEach(function(result, idx) {
          app.ViewModel.places.push(results[idx]);
          app.ViewModel.placesArr.push(results[idx]); //REMOVE
          app.Map.createMarker(result);
        });
      } else {
        console.log(status);  // TODO: Add UI error handling
      }
    });
  },

  getPlaceDetails: function(place) {
    console.log('Getting Place Details'); // REMOVE
    var placesApi = new google.maps.places.PlacesService(app.Map.map);
    var request = {
      placeId: place.place_id
    };
    placesApi.getDetails(request, function(loc, status) {
      if (status === 'OK') {
        return loc;
      } else {
        console.log(status);  // TODO: Add UI error handling
      }
    });
  },

  createMarker: function(place) {
    var marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      attribution: {source: 'mrkjesus2.github.io/Neighborhood-Map'},
      icon: place.icon,
      map: app.Map.map,
      // optimized: false,  // If problems with animation, uncomment
      place: {
        location: place.geometry.location,
        placeId: place.place_id
      },
      title: place.name
    });
    // TODO: Set the content for infoWindow
    var info = place.name;

    // Add click event to the Marker
    google.maps.event.addListener(marker, 'click', function() {
      console.log(place.name, 'Marker Clicked');
      app.Map.infoWindow.setContent(info);
      app.Map.infoWindow.open(this.map, marker);
    });

  }
};

// // TODO: Add powered by google logo

// // All function related to Google Maps go here
// (function() {
//   'use strict';

//   var map, bounds, infowindow;

//   window.initMap = function() {
//     var home = new google.maps.LatLng(39.927677, -75.171909);
//     var el = document.getElementById('map-container');
//     map = new google.maps.Map(el, {
//       center: home,
//       zoom: 15
//     });

//     infowindow = new google.maps.InfoWindow();
//     google.maps.event.addDomListener(window, 'load', getPlaces);
//   }

//   function getPlaces() {
//     bounds = map.getBounds();
//     var request = {
//       bounds: bounds,
//       types: ['restaurant']
//     };

//     var service = new google.maps.places.PlacesService(map);
//     service.nearbySearch(request, getPlaceDetails);
//   }

//   function getPlaceDetails(results, status) {
//     var service = new google.maps.places.PlacesService(map);

//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//       for (var i = 0; i < results.length; i++) {
//         var place = results[i];
//         service.getDetails({ placeId: place.place_id }, placeMarkers);
//       };
//     }
//   }

//   function placeMarkers(place, status) {
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//       createMarker(place);
//     }
//   }

//   function createMarker(place) {
//     var placeLoc = place.geometry.location;
//     var marker = new google.maps.Marker({
//       // The map the marker gets added to
//       map: map,
//       // Location of the marker
//       position: placeLoc,
//       // Get the icon from the places API
//       icon: place.icon,
//       place: {
//         location: place.geometry.location,
//         placeId: place.place_id
//       }
//     });
//       // console.log(place.place_id);
//     var info = createInfoWindow(place);

//     google.maps.event.addListener(marker, 'click', function() {
//         infowindow.setContent(info);
//         infowindow.open(map, this);
//     });
//   }

//   function createInfoWindow(place) {
//     var container = document.createElement('div');
//     var title = document.createElement('h3');
//     var phoneNum = document.createElement('h4');
//     var website = document.createElement('h4');
//     var sitelink = document.createElement('a');
//     var address = document.createElement('h5');
//     var pic = document.createElement('img');

//     container.setAttribute('id', 'info-window');
//     sitelink.setAttribute('href', place.website);

//     title.innerText = place.name || '';
//     phoneNum.innerText = place.formatted_phone_number || '';
//     sitelink.innerText = place.website || '';
//     address.innerText = place.formatted_address || '';

//     container.appendChild(title);
//     container.appendChild(phoneNum);
//     website.appendChild(sitelink);
//     container.appendChild(website);
//     container.appendChild(address);

//     if (place.photos) {
//       pic.setAttribute( 'src', place.photos[0].getUrl({'maxWidth': 250}) );
//       container.appendChild( pic );
//     }

//     return container;
//   }
// })();

