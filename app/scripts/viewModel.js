app.ViewModel = app.ViewModel || {};

app.ViewModel = {
  places: ko.observableArray()
};

ko.applyBindings(app.ViewModel);

