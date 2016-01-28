app.ViewModel = app.ViewModel || {};

app.ViewModel = {
  places: ko.observableArray(),
  markers: ko.observableArray()
};

ko.applyBindings(app.ViewModel);

