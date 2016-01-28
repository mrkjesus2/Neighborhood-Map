app.ViewModel = app.ViewModel || {};

app.ViewModel = {
  places: ko.observableArray(),
  markers: ko.observableArray(),

  listClick: function() {
    // Select the marker for the place that was clicked
  },

  markerClick: function() {
    // Highlight the name in the list for the marker that was clicked
  },

  listfilter: function() {
    // Filter the list based on what is type in input box
  },

  markerfilter: function() {
    // Remove markers that don't fit the input box text
  }
};

ko.applyBindings(app.ViewModel);

