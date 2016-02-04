// TODO: Get rid of 'REMOVE' lines
/* global app ko */

app.viewmodel = app.viewmodel || {};

app.viewmodel = {
  places: ko.observableArray(),
  curMarker: null,
  inputText: ko.observable(''),

  Place: function(place, marker) {
    this.name = ko.observable(place.name);
    this.data = place;
    this.marker = marker;
    this.show = ko.observable(true);
    this.wikiInfo = ko.observable(app.wiki.getWiki(this));
    this.frSqrInfo = ko.observable(app.foursquare.findPlace(this));
    // console.log(this);  // REMOVE
  },

  // Called when the marker or list item is clicked
  clickHandler: function(place) {
    var plc = place || this;
    app.view.closeDrawer();
    app.viewmodel.markerSetup(plc);
  },

  placeFilter: function() {
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
    // Bounce the marker when selected
    if (this.curMarker) {
      app.map.toggleBounce();
    }
    this.curMarker = place.marker;
    app.map.toggleBounce();

    // Fill the info window
    app.map.infoWindow.setContent(place.wikiInfo());
    app.map.infoWindow.open(app.map.map, place.marker);
  }
};
ko.applyBindings(app.viewmodel);

