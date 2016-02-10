// TODO: Get rid of 'REMOVE' lines
/* global app ko */

app.viewmodel = app.viewmodel || {};

app.viewmodel = {
  places: ko.observableArray(),
  curMarker: null,
  curPlace: ko.observable(),
  inputText: ko.observable(''),
  frsqr: null,

/****************/
/* Constructors */
/****************/
  Place: function(place) {
    console.log(place.photos);
    this.show = ko.observable(true);

    // Info returned from map.getPlaces
    this.name = ko.observable(place.name);
    this.rating = ko.observable(place.rating);
    this.open = ko.observable(
      place.opening_hours ? 'Open' : 'Closed' || 'Hours not available'
    );
    if (place.photos) {

    this.photo = ko.observable({
      url: ko.observable(place.photos[0].getUrl),
      height: ko.observable(place.photos[0].height),
      width: ko.observable(place.photos[0].width),
      attributions: ko.observable(place.photos[0].html_attributions)
    });
    }
    this.data = place;

    // Info from elsewhere
    this.details = ko.observable(); // app.map.getPlaceDetails(this)
    this.marker = app.map.createMarker(this);
    this.wikiInfo = ko.observable(); // app.wiki.getWiki(this)
    this.frSqrInfo = ko.observable(); // app.foursquare.findPlace(this)
    // console.log('Place Constructor');  // REMOVE
  },

// TODO: This function probably needs to written for Places API
  getPhoto: function(place, url, width, height) {

  },

  WikiPage: function(page) {
    console.log(this);
    this.content = ko.observable(page.extract);
    this.url = ko.observable(page.fullurl);
  },

  FourSquare: function(info) {
    console.log('FourSquare Constructor'); // REMOVE
    // Map FourSquare response to observables
    ko.mapping.fromJS(info, {}, this);
  },

  PlaceDetails: function(details) {
    // console.log(this);
    // console.log(details);
    this.show = ko.observable(true);
    this.address = ko.observable(details.formatted_address);// || 'Waiting');
    this.phone = ko.observable(details.formatted_phone_number);// || 'Waiting')
    this.photos = ko.observableArray(details.photos);// || [];
    this.rating = ko.observable(details.rating);// || 'Waiting');
    this.reviews = ko.observableArray(details.reviews);// || [];
    this.website = ko.observable(details.website);// || 'Waiting');
    console.log('PlaceDetails'); // REMOVE
  },

/********************/
/* Helper Functions */
/********************/
  getDetails: function(place) {
    app.map.getPlaceDetails(place);
  },

  hideDetails: function(details) {
    details.show(false);
  },

  setCurrentPlace: function(place) {
    console.log('setCurrentPlace'); // REMOVE
    if (app.viewmodel.curPlace().marker.getAnimation()) {
      app.viewmodel.toggleBounce();
    }
    app.viewmodel.curPlace(place);
  },

  // Called when the marker or list item is clicked
  clickHandler: function(place) {
    console.log('clickHandler'); // REMOVE
    var plc = place || this;

    // Call for data
    app.wiki.getWiki(plc);
    app.foursquare.findPlace(plc);
    // app.map.getPlaceDetails(plc);

    // Handle map actions
    app.map.infoWindow.close();
    app.viewmodel.closeDrawer();
    app.viewmodel.setCurrentPlace(plc);
    app.viewmodel.toggleBounce();
    // app.viewmodel.markerSetup(plc);

    // Timeout to avoid two calls from success callbacks
    setTimeout(function() {
      app.viewmodel.setInfoWindow(plc);
    }, 200);
  },

  placeFilter: function() {
    console.log('placeFilter'); // REMOVE
    var self = this;
    // A cushion to allow inputText to change
    setTimeout(function() {
      // Get the matching places
      if (self.inputText()) {
        var matches = self.places().filter(function(place) {
          var name = place.name().toLowerCase();
          var input = self.inputText().toLowerCase();
          return name.indexOf(input) !== -1;
        });

        // Set markers and list items to hidden
        self.places().forEach(function(place) {
          place.marker.setMap(null);
          place.show(false);
        });

        // Add remaining places to the map and list
        matches.forEach(function(place) {
          place.marker.setMap(app.map.map);
          place.show(true);
        });
      } else {
        self.places().forEach(function(place) {
          place.marker.setMap(app.map.map);
          place.show(true);
        });
      }
    }, 100);

    // Must return true to allow default behavior(Filling the input box)
    return true;
  },

  toggleBounce: function() {
    console.log('Map toggleBounce'); // REMOVE
    // app.viewmodel.curPlace().marker.setAnimation(null);
    if (app.viewmodel.curPlace().marker.getAnimation()) {
      app.viewmodel.curPlace().marker.setAnimation(null);
    } else {
      app.viewmodel.curPlace().marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  },

  setInfoWindow: function(place) {
    var content = $('#infowindow').html();
      app.map.infoWindow.setContent(content);
      app.map.infoWindow.open(app.map.map, place.marker);
  },

  toggleDrawer: function() {
    console.log('toggleDrawer'); // REMOVE
    var els = document.getElementsByClassName('drawer');
    $(els).toggleClass('closed open');
  },

  closeDrawer: function() {
    console.log('closeDrawer'); // REMOVE
    var els = document.getElementsByClassName('drawer');
    if ($(els).hasClass('open')) {
      app.viewmodel.toggleDrawer();
    }
  },

  init: function() {
    console.log('init'); // REMOVE
    var button = document.getElementById('drawer-btn');
    button.addEventListener('click', app.viewmodel.toggleDrawer);

  }

};

app.viewmodel.init();
ko.applyBindings(app.viewmodel);
