app.map = app.map || {};

(function() {

  app.map = {
    // Callback function for Google Maps - Initialize the Map
    // Calls getPlaces and createMarker to fill ViewModel places array
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
      console.log('Map Initialized'); // REMOVE
      // Load places once the maps bounds are set
      google.maps.event.addListenerOnce(this.map, 'bounds_changed', this.getPlaces);
    },

    // Get a list of places from Google Maps
    getPlaces: function() {
      console.log('Getting Places'); // REMOVE
      // Variables for the request
      var placesApi = new google.maps.places.PlacesService(app.map.map);
      var request = {
        bounds: app.map.map.getBounds(),
        types: ['art_gallery', 'museum', 'park']
      };
      // Call the Places API
      placesApi.nearbySearch(request, function(results, status) {
        if (status === 'OK') {
          results.forEach(function(result, idx) {
            app.map.createMarker(result);
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
      var placesApi = new google.maps.places.PlacesService(app.map.map);
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
      // Location for the Marker
      var plcloc = place.geometry.location
      // Create the marker
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        attribution: {source: 'mrkjesus2.github.io/Neighborhood-Map'},
        icon: place.icon,
        map: app.map.map,
        // optimized: false,  // If problems with animation, uncomment //REMOVE
        place: {
          location: {lat: plcloc.lat(), lng: plcloc.lng()},
          placeId: place.place_id
        },
        title: place.name
      });

      // Create the array of places
      var newPlace = new app.viewmodel.Place(place, marker);
      app.viewmodel.places.push(newPlace);

      google.maps.event.addListener(marker, 'click', function() {
          app.viewmodel.markerClick(newPlace);
      });
    },

    curMarkerCheck: function() {
      if (app.viewmodel.curMarker) {
        return true;
      }
      return false;
    },

    toggleBounce: function() {

      if (app.viewmodel.curMarker.getAnimation()) {
        app.viewmodel.curMarker.setAnimation(null);
      } else {
        app.viewmodel.curMarker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
  };


})();
// // TODO: Add powered by google logo
