/* global app document google $ window ko localStorage */
app.map = app.map || {};

(function() {
  app.map = {
    // Callback function for Google Maps - Initialize the Map
    init: function() {
      // console.log('map.init'); // REMOVE
      var home = {lat: 39.927677, lng: -75.171909};
      var el = document.getElementById('map-container');

      this.map = new google.maps.Map(el, {
        center: home,
        zoom: 14,
        minZoom: 12,
        maxZoom: 18,
        mapTypeControl: false
      });
      this.placesApi = new google.maps.places.PlacesService(app.map.map);

      // Load places once the maps bounds are set
      google.maps.event.addListenerOnce(
        this.map, 'bounds_changed', this.getPlaces
      );
    },

    // with a little help from 'http://jsfiddle.net/G6MXd/4/'
    createInfoWindow: function(place) {
      // console.log('createInfoWindow'); // REMOVE
      var content =
        '<div id="test"\
          data-bind="template: {name: \'infowindow\', data: curPlace}">\
        </div>';

      if (!this.infoWindow) {
        console.log('Initializing infoWindow'); // REMOVE

        var infoWindowLoaded;

        this.infoWindow = new google.maps.InfoWindow({
          maxWidth: $(window).width() * 0.7,
          content: content
        });

        // Apply bindings once the window is attached to DOM
        google.maps.event.addListener(this.infoWindow, 'domready', function() {
          if (!infoWindowLoaded) {
            ko.applyBindings(app.viewmodel, $('#test')[0]);
            infoWindowLoaded = true;
          }
        });

        // Show the drawer button when infowindow closes
        google.maps.event.addListener(this.infoWindow, 'closeclick', function() {
          app.viewmodel.infoWindow(false);
        });

        // Hide the drawer button while window is open
        app.viewmodel.infoWindow(true);

        app.viewmodel.clickHandler(place);

        // Handle when the infoWindow exists
      } else {
        console.log('Info Window Else Statement'); // REMOVE
        this.infoWindow.open(app.map.map, place.marker);

        app.viewmodel.clickHandler(place);
      }
    },

    createPlaces: function(places) {
      // console.log('createPlaces'); // REMOVE
      places.forEach(function(place, idx) {
        var plc = new app.viewmodel.Place(place);

        app.viewmodel.places.push(plc);
        app.viewmodel.placeList.push(plc.name());
        if (idx === 1) {
          app.viewmodel.curPlace(plc);
        }
      });
      app.viewmodel.autocomplete();
    },

    // Likely against TOS, but figure it's fine for educational purposes
    storePlaces: function(places) {
      // console.log('storePlaces'); // REMOVE
      localStorage.setItem('places', JSON.stringify(places));
    },

    retrievePlaces: function() {
      // console.log('retrievePlaces'); // REMOVE
      var places = JSON.parse(localStorage.places);
      places.forEach(function(place) {
        var lat = place.geometry.location.lat;
        var lng = place.geometry.location.lng;
        // Make lat/lng into functions to match API results
        place.geometry.location.lat = function() {
          return lat;
        };
        place.geometry.location.lng = function() {
          return lng;
        };
      });
      return places;
    },

    // Get a list of places from Google Maps
    getPlaces: function() {
      // console.log('getPlaces'); // REMOVE
      if (localStorage.places && app.map.sameBoundsCheck()) {
        console.log('Creating places from storage');
        app.map.createPlaces(app.map.retrievePlaces());
        ko.applyBindings(app.viewmodel, $('.container')[0]);
      } else {
        localStorage.setItem('bounds', JSON.stringify(app.map.map.getBounds()));
        // Variables for the request
        var request = {
          bounds: app.map.map.getBounds(),
          types: ['art_gallery', 'museum', 'park']
        };

        // Call the Places API
        app.map.placesApi.nearbySearch(request, function(results, status) {
          console.log('Calling Places API');
          if (status === 'OK') {
            app.map.setPhotoUrls(results);
            app.map.storePlaces(results);
            app.map.createPlaces(results);
          } else {
            console.log('We have a places error');
            var msg = 'Google Places Error: ' + status;
            app.viewmodel.addError(msg);
          }
          ko.applyBindings(app.viewmodel, $('.container')[0]);
        });
      }
    },

    sameBoundsCheck: function() {
      // console.log('sameBoundsCheck'); // REMOVE
      if (localStorage.bounds) {
        var oldBounds = JSON.parse(localStorage.bounds);
        return app.map.map.getBounds().equals(oldBounds);
      }
      return false;
    },

    setPhotoUrls: function(places) {
      // console.log('setPhotoUrls'); // REMOVE
      places.forEach(function(place) {
        if (place.photos) {
          var url = place.photos[0].getUrl({maxWidth: 200,
                                            maxHeight: 300});
          place.photos[0].url = url;
        }
      });
    },

    getPlaceDetails: function(place) {
      // console.log('getPlaceDetails'); // REMOVE
      var request = {
        placeId: place.data.place_id
      };
      // Call the Places API, add details to the place
      app.map.placesApi.getDetails(request, function(details, status) {
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
      // console.log('createMarker'); // REMOVE
      // Location for the Marker
      var plcloc = place.data.geometry.location;
      // Set icon and icon size
      var image = {
        url: place.data.icon,
        scaledSize: new google.maps.Size(50, 50)
      };
      // Create the marker
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        attribution: {source: 'mrkjesus2.github.io/Neighborhood-Map'},
        icon: image,
        map: app.map.map,
        place: {
          location: {lat: plcloc.lat(), lng: plcloc.lng()},
          placeId: place.data.place_id
        },
        title: place.data.name
      });

      google.maps.event.addListener(marker, 'click', function() {
        // app.viewmodel.clickHandler(place);
        app.map.createInfoWindow(place); // test
      });
      return marker;
    }
  };
})();
