// TODO: Get rid of 'REMOVE' lines
/* global app ko */

app.ViewModel = app.ViewModel || {};

app.ViewModel = {
  places: ko.observableArray(), // {place: {obj},
                                //  marker: {obj},
                                //  wiki: {obj}
                                //  foursquare: {obj}
                                // }

  Place: function(place, marker) {
    this.name = ko.observable(place.name);
    this.data = place;
    this.marker = marker;
    this.wikiInfo = ko.observable(app.Wiki.getWiki(this));
    this.frSqrInfo = ko.observable(app.FourSquare.findPlace(this));
    // console.log('New place');
  },

  // Select the marker for the place that was clicked
  listClick: function() {
    app.Map.infoWindow.setContent(this.name());
    app.Map.infoWindow.open(app.Map.map, this.marker);

    console.log(this.wikiInfo());
    console.log(this.frSqrInfo());
  },

  markerClick: function() {
    // Highlight the name in the list for the marker that was clicked
  },

  listfilter: function() {
    // Filter the list based on what is type in input box
  },

  markerfilter: function() {
    // Remove markers that don't fit the input box text
    this.markers.forEach(function(marker) {
      marker.setMap(null);
    });
  }
};

ko.applyBindings(app.ViewModel);
