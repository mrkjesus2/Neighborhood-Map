// TODO: Get rid of 'REMOVE' lines
/* global app ko */

app.viewmodel = app.viewmodel || {};

app.viewmodel = {
  places: ko.observableArray(),
  curMarker: null,
  curPlace: ko.observable(),
  inputText: ko.observable(''),
  frsqr: null,

  Place: function(place, marker) {
    this.name = ko.observable(place.name);
    this.data = place;
    this.marker = marker;
    this.show = ko.observable(true);
    this.wikiInfo = ko.observable(app.wiki.getWiki(this));
    this.frSqrInfo = ko.observable(app.foursquare.findPlace(this));
    console.log('Place Constructor');  // REMOVE
  },

  WikiPage: function(page) {
    this.content = ko.observable(page.extract);
    this.url = ko.observable(page.fullurl);
  },

  FourSquare: function(info) {
    console.log('FourSquare Constructor'); // REMOVE
    // Map FourSquare response to observables
    ko.mapping.fromJS(info, {}, this);
  },

  setCurrentPlace: function(place) {
    console.log('setCurrentPlace'); // REMOVE
    app.viewmodel.curPlace(place);
  },

  // Called when the marker or list item is clicked
  clickHandler: function(place) {
    console.log('clickHandler'); // REMOVE
    var plc = place || this;
    app.viewmodel.setCurrentPlace(plc);
    app.viewmodel.closeDrawer();
    app.viewmodel.markerSetup(plc);
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

  markerSetup: function(place) {
    console.log('markerSetup'); // REMOVE
    var content = $('#infowindow').html();
    console.log(content);
    // Bounce the marker when selected
    if (this.curMarker) {
      app.map.toggleBounce();
    }
    this.curMarker = place.marker;
    app.map.toggleBounce();

    // Fill the info window
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

    return {
      button: button,
    }
  }

};

app.viewmodel.init();
ko.applyBindings(app.viewmodel);
