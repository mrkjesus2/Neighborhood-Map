app.Map = app.Map || {};
var i = 1;
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
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
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
    console.log(i + ': ', place.name);
    // TODO: Set the content for infoWindow
    var info = place.name;
    i++;
    // Add click event to the Marker
    google.maps.event.addListener(marker, 'click', function() {
      console.log(place.name, 'Marker Clicked');
      app.FourSquare.findPlace(place.name, lat, lng, i);
      app.Map.infoWindow.setContent(info);
      app.Map.infoWindow.open(this.map, marker);
    });

  }
};

// // TODO: Add powered by google logo
