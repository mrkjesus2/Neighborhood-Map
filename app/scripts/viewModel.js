app.ViewModel = app.ViewModel || {};

app.ViewModel = {
  places: ko.observableArray(),
  placesArr: [] // REMOVE
};

ko.applyBindings(app.ViewModel);

