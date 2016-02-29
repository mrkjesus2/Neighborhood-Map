/* global app ko google document Awesomplete */

app.viewmodel = app.viewmodel || {};

app.viewmodel = {
  mapError: ko.observable(),
  places: ko.observableArray(),
  placeList: [],
  curMarker: null,
  curPlace: ko.observable(),
  inputText: ko.observable(''),
  frsqr: null,
  errorMsg: ko.observableArray([]),
  infoWindow: ko.observable(false),
  drawerOpen: ko.observable(false),
  showModal: ko.observable(false),

/* ************* */
/* Constructors */
/* ************ */
  Place: function(place) {
    console.log('Place constructor'); // REMOVE
    this.show = ko.observable(true);

    // Info returned from map.getPlaces
    this.name = ko.observable(place.name);
    this.rating = ko.observable(place.rating);
    this.open = ko.observable(
      place.opening_hours ? 'Open Now' : 'Closed' || 'Hours not available'
    );
    if (place.photos) {
      this.photo = ko.observable({
        url: ko.observable(place.photos[0].url),
        height: ko.observable(place.photos[0].height),
        width: ko.observable(place.photos[0].width),
        attributions: ko.observable(place.photos[0].html_attributions)
      } || {});
    } else {
      this.photo = ko.observable('none');
    }
    this.data = place;
    this.detailsIcon = ko.observable('fa fa-chevron-circle-up');

    // Info from elsewhere
    this.details = ko.observable();
    this.marker = app.map.createMarker(this);
    this.wikiInfo = ko.observable();
    this.frSqrInfo = ko.observable();
  },

  WikiPage: function(page) {
    console.log('WikiPage Constructor'); // REMOVE
    this.content = ko.observable(page.extract);
    this.url = ko.observable(page.fullurl);
  },

  fourSquare: function(info, tips, place) {
    console.log('fourSquare constructor'); // REMOVE
    // Map FourSquare responses to observables
    var frSqrInfo = ko.mapping.fromJS(info, {});
    var frSqrTips = ko.mapping.fromJS(tips, {});
    // Create a child object for tips response
    frSqrInfo.tips = frSqrTips;
    // Assign the info to the place
    place.frSqrInfo(frSqrInfo);
  },

  PlaceDetails: function(details) {
    console.log('PlaceDeatails constructor'); // REMOVE
    this.show = ko.observable(true);
    this.address = ko.observable(details.formatted_address);
    this.phone = ko.observable(details.formatted_phone_number);
    this.photos = ko.observableArray(details.photos);
    this.rating = ko.observable(details.rating);
    this.website = ko.observable(details.website);
    this.reviews = ko.observableArray(
      new app.viewmodel.Reviews(details.reviews)
    );
  },

  Reviews: function(reviews) {
    console.log('Reviews constructor'); // REMOVE
    var arr = [];
    reviews.forEach(function(review) {
      arr.push({
        author: ko.observable(review.author_name),
        authorUrl: ko.observable(review.author_url),
        text: ko.observable(review.text),
        time: ko.observable(review.time)
      });
    });
    return arr;
  },

/* **************** */
/* Helper Functions */
/* **************** */
  addError: function(msg) {
    console.log('addError'); // REMOVE
    this.errorMsg = this.errorMsg || ko.observableArray([]);
    this.errorMsg.push(msg);
    setTimeout(function() {
      app.viewmodel.clearErrors();
    }, 2000);
  },

  clearErrors: function() {
    console.log('clearErrors'); // REMOVE
    this.errorMsg([]);
  },

  setCurrentPlace: function(place) {
    console.log('setCurrentPlace'); // REMOVE
    if (app.viewmodel.curPlace().marker.getAnimation()) {
      app.viewmodel.toggleBounce();
    }
    app.viewmodel.curPlace(place);
  },

  toggleDetails: function(place) {
    console.log('toggleDetails'); // REMOVE
    if (place.details() !== undefined && place.details().show() === true) {
      place.details().show(false);
      place.detailsIcon('fa fa-chevron-circle-up');
    } else {
      app.map.getPlaceDetails(place);
      app.viewmodel.setCurrentPlace(place);
      place.detailsIcon('fa fa-chevron-circle-down');
    }
  },

  clickContactInfo: function() {
    console.log('clickContactInfo'); // REMOVE
    this.inputText(this.curPlace().name());
    app.viewmodel.placeFilter();
    this.toggleDetails(app.viewmodel.curPlace());
    app.map.infoWindow.close();
    app.viewmodel.infoWindow(false);
    this.toggleDrawer();
  },

  // Called when the marker or list item is clicked
  clickHandler: function(place) {
    console.log('clickHandler'); // REMOVE
    var plc = place || this;

    // Open infoWindow on list click
    if (app.viewmodel.infoWindow() === false) {
      app.viewmodel.infoWindow(true);
      app.map.createInfoWindow(plc);
    }

    // Call for data
    app.wiki.getWiki(plc);
    app.foursquare.findPlace(plc);

    // Handle map actions
    if (app.viewmodel.drawerOpen()) {
      app.viewmodel.toggleDrawer();
    }
    app.viewmodel.setCurrentPlace(plc);
    app.viewmodel.toggleBounce();
  },

  findPlaceByName: function(name) {
    console.log('findPlaceByName'); // REMOVE
    var places = app.viewmodel.places();
    for (var i = places.length - 1; i >= 0; i--) {
      if (places[i].name() === name) {
        return places[i];
      }
    }
    return false;
  },

  placeFilter: function() {
    console.log('placeFilter'); // REMOVE
    var self = this;

    if (self.inputText()) {
      var matches = self.places().filter(function(place) {
        var name = place.name().toLowerCase();
        var input = self.inputText().toLowerCase();
        return name.indexOf(input) >= 0;
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
      // Set all place markers on the map
      self.places().forEach(function(place) {
        place.marker.setMap(app.map.map);
        place.show(true);
      });
    }

    return true;
  },

  resetFilter: function() {
    console.log('resetFilter'); // REMOVE
    app.viewmodel.inputText('');
    app.viewmodel.placeFilter();
    // Close details which are open
    var places = this.places();
    for (var i = places.length - 1; i >= 0; i--) {
      if (places[i].details() && places[i].details().show()) {
        places[i].details().show(false);
        places[i].detailsIcon('fa fa-chevron-circle-up');
      }
    }
  },

  // setInfoWindow: function(place) {
    // console.log('setInfoWindow'); // REMOVE
  //   var content = $('#infowindow').html();

  //   app.map.infoWindow.setContent(content);
  //   app.map.infoWindow.open(app.map.map, place.marker);
  //   // Hide the drawer button while infowindow is open
  //   app.viewmodel.infoWindow(true);
  // },

  toggleBounce: function() {
    console.log('toggleBounce'); // REMOVE
    if (app.viewmodel.curPlace().marker.getAnimation()) {
      app.viewmodel.curPlace().marker.setAnimation(null);
    } else {
      var marker = app.viewmodel.curPlace().marker;
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  },

  toggleDrawer: function() {
    console.log('toggleDrawer'); // REMOVE
    app.viewmodel.drawerOpen(!app.viewmodel.drawerOpen());
  },

  setModal: function() {
    console.log('setModal'); // REMOVE
    app.viewmodel.showModal(!app.viewmodel.showModal());
  },

  autocomplete: function() {
    console.log('autocomplete'); // REMOVE
    var input = document.getElementById('place-input');
    var awesomplete = new Awesomplete(input);
    awesomplete.list = app.viewmodel.placeList;

    input.addEventListener('awesomplete-selectcomplete', function() {
      var place = app.viewmodel.findPlaceByName(this.value);
      console.log(place);
      app.viewmodel.setCurrentPlace(place);
      app.viewmodel.toggleDetails(place);
      app.viewmodel.inputText(this.value);
      app.viewmodel.placeFilter();
    });
  }
};

