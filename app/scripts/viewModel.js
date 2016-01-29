// TODO: Get rid of 'REMOVE' lines
/* global app ko */

app.viewmodel = app.viewmodel || {};

app.viewmodel = {
  places: ko.observableArray(),
  curMarker: null,

  Place: function(place, marker) {
    this.name = ko.observable(place.name);
    this.data = place;
    this.marker = marker;
    this.wikiInfo = ko.observable(app.wiki.getWiki(this));
    this.frSqrInfo = ko.observable(app.foursquare.findPlace(this));
    // console.log(this);  // REMOVE
  },

  // Select the marker for the place that was clicked
  listClick: function() {
    app.viewmodel.markerSetup(this);

  },

  markerClick: function(place) {
    // Highlight the name in the list for the marker that was clicked
    app.viewmodel.markerSetup(place);

  },

  listfilter: function() {
    // Filter the list based on what is type in input box
  },

  markerfilter: function() {
    // Remove markers that don't fit the input box text
    this.markers.forEach(function(marker) {
      marker.setMap(null);
    });
  },

  markerSetup: function(place) {
    // Bounce the marker when selected
    if (this.curMarker) {app.map.toggleBounce()};
    this.curMarker = place.marker;
    app.map.toggleBounce();

    // Fill the info window
    app.map.infoWindow.setContent(place.wikiInfo());
    app.map.infoWindow.open(app.map.map, place.marker);
  },
};

ko.applyBindings(app.viewmodel);
