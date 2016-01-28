app.Map = app.Map || {};

app.Map = {
  // Callback function for Google Maps - Initialize the Map
  init: function() {
    this.infoWindow = new google.maps.InfoWindow;
    var home = {lat: 39.927677, lng: -75.171909};
    var el = document.getElementById('map-container');
    this.map = new google.maps.Map(el, {
      center: home,
      zoom: 14,
      minZoom: 12,
      maxZoom: 18
    });
    // console.log('Map Initialized'); // REMOVE
    // Load places once the maps bounds are set
    google.maps.event.addListenerOnce(this.map, 'bounds_changed', this.getPlaces);
  },

  // Get a list of places from Google Maps
  getPlaces: function() {
    // console.log('Getting Places'); // REMOVE
    // Variables for the request
    var placesApi = new google.maps.places.PlacesService(app.Map.map);
    var request = {
      bounds: app.Map.map.getBounds(),
      types: ['art_gallery', 'museum', 'park']
    };
    // Call the Places API
    placesApi.nearbySearch(request, function(results, status) {
      if (status === 'OK') {
        results.forEach(function(result, idx) {
          app.ViewModel.places.push(results[idx]);
          app.Map.createMarker(result);
        });
      } else {
        // TODO: Add UI error handling
        console.log(status);
      }
    });
  },

  // TODO: implement this on click or REMOVE
  getPlaceDetails: function(place) {
    // console.log('Getting Place Details'); // REMOVE
    // Variables for the request
    var placesApi = new google.maps.places.PlacesService(app.Map.map);
    var request = {
      placeId: place.place_id
    };
    // Call the Places API
    placesApi.getDetails(request, function(loc, status) {
      if (status === 'OK') {
        return loc;
      } else {
        // TODO: Add UI error handling
        console.log(status);
      }
    });
  },

  createMarker: function(place) {
    // Location for the Marker and Foursquare
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    // Marker options
    var marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      attribution: {source: 'mrkjesus2.github.io/Neighborhood-Map'},
      icon: place.icon,
      map: app.Map.map,
      // optimized: false,  // If problems with animation, uncomment
      place: {
        location: {lat: lat, lng: lng},
        placeId: place.place_id
      },
      title: place.name
    });

    // TODO: Set the content for infoWindow
    var info = place.name;

    // Add click event to the Marker
    google.maps.event.addListener(marker, 'click', function() {
      app.FourSquare.findPlace(place.name, lat, lng);
      app.Wiki.getWiki(place.name);
      app.Map.infoWindow.setContent(info);
      app.Map.infoWindow.open(this.map, marker);
    });

  }
};

// // TODO: Add powered by google logo
