app.map = app.map || {};

(function() {

  app.map = {
    // Callback function for Google Maps - Initialize the Map
    // Calls getPlaces and createMarker to fill ViewModel places array
    init: function() {
      var home = {lat: 39.927677, lng: -75.171909};
      var el = document.getElementById('map-container');

      this.map = new google.maps.Map(el, {
        center: home,
        zoom: 14,
        minZoom: 12,
        maxZoom: 18,
        mapTypeControl: false
      });
      console.log('Map init'); // REMOVE

      this.placesApi = new google.maps.places.PlacesService(app.map.map)
      this.infoWindow = new google.maps.InfoWindow({
        maxWidth: $(window).width() * .7}
      );
      // Show the drawer button when infowindow closes
      google.maps.event.addListener(this.infoWindow, 'closeclick', function() {
        $('#drawer-btn').removeClass('open');
        $('#drawer-btn').addClass('closed');
      });

      // Show error message - if maps can't be reached it will be visible
      setTimeout(function() {
        $('#maps-error').css('display', 'inline');
      }, 5000);
      // Load places once the maps bounds are set
      google.maps.event.addListenerOnce(this.map, 'bounds_changed', this.getPlaces);
    },

    // Get a list of places from Google Maps
    getPlaces: function() {
      console.log('Map getPlaces'); // REMOVE
      // Variables for the request
      var request = {
        bounds: app.map.map.getBounds(),
        types: ['art_gallery', 'museum', 'park']
      };

      // Call the Places API
      app.map.placesApi.nearbySearch(request, function(results, status) {
        if (status === 'OK') {
          results.forEach(function(result, idx) {
            var place = new app.viewmodel.Place(result);

            app.viewmodel.places.push(place);
            if (idx === 1) {
              console.log("set current place");
              app.viewmodel.curPlace(place);
            }
          });
        } else {
          console.log('We have a places error');
          var msg = 'Google Places Error: ' + status;
          app.viewmodel.addError(msg);
        }
        ko.applyBindings(app.viewmodel);
      });
    },

    getPlaceDetails: function(place) {
      console.log('Map getPlaceDetails'); // REMOVE
      var request = {
        placeId: place.data.place_id
      };
      // Call the Places API, add details to the place
      app.map.placesApi.getDetails(request, function(details, status) {
        console.log('status', status);
        if (status === 'OK') {
          var deets = new app.viewmodel.PlaceDetails(details);
          place.details(deets);
        } else {
          var msg = 'Google Places Error while getting details: ' + status;
          app.viewmodel.addError(msg);
        }
      });
    },

    createMarker: function(place) {
      // console.log('Map createMarker'); // REMOVE
      // Location for the Marker
      var plcloc = place.data.geometry.location
      // Create the marker
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        attribution: {source: 'mrkjesus2.github.io/Neighborhood-Map'},
        icon: place.data.icon,
        map: app.map.map,
        // optimized: false,  // If problems with animation, uncomment //REMOVE
        place: {
          location: {lat: plcloc.lat(), lng: plcloc.lng()},
          placeId: place.data.place_id
        },
        title: place.data.name
      });

      google.maps.event.addListener(marker, 'click', function() {
          app.viewmodel.clickHandler(place);
      });
      return marker;
    },
    // TODO: Should there be a return obect here (Module thinking>>>)
    // Would require a variable that indicates doneness?
  };
})();
