// TODO: Get rid of 'REMOVE' lines
/* global app ko */

app.viewmodel = app.viewmodel || {};

app.viewmodel = {
  places: ko.observableArray(),

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
    app.viewmodel.setInfoWindow(this);

  },

  markerClick: function(place) {
    // Highlight the name in the list for the marker that was clicked
    app.viewmodel.setInfoWindow(place);
    console.log('Marker clicked');
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

  setInfoWindow: function(place) {
    // console.log(place);
    app.map.infoWindow.setContent(place.wikiInfo());
    app.map.infoWindow.open(app.map.map, place.marker);
  }
};

ko.applyBindings(app.viewmodel);
