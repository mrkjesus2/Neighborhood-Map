/* global app ko $ google document */

app.viewmodel = app.viewmodel || {};

app.viewmodel = {
  mapError: ko.observable(),
  places: ko.observableArray(),
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
    this.content = ko.observable(page.extract);
    this.url = ko.observable(page.fullurl);
  },

  fourSquare: function(info, tips, place) {
    // Map FourSquare responses to observables
    var frSqrInfo = ko.mapping.fromJS(info, {});
    var frSqrTips = ko.mapping.fromJS(tips, {});
    // Create a child object for tips response
    frSqrInfo.tips = frSqrTips;
    // Assign the info to the place
    place.frSqrInfo(frSqrInfo);
  },

  PlaceDetails: function(details) {
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
    this.errorMsg = this.errorMsg || ko.observableArray([]);
    this.errorMsg.push(msg);
    setTimeout(function() {
      app.viewmodel.clearErrors();
    }, 2000);
  },

  clearErrors: function() {
    this.errorMsg([]);
  },

  setCurrentPlace: function(place) {
    if (app.viewmodel.curPlace().marker.getAnimation()) {
      app.viewmodel.toggleBounce();
    }
    app.viewmodel.curPlace(place);
  },

  toggleDetails: function(place) {
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
    this.inputText(this.curPlace().name());
    $('#drawer-top input').trigger('input');
    this.toggleDetails(app.viewmodel.curPlace());
    app.map.infoWindow.close();
    this.toggleDrawer();
  },

  // Called when the marker or list item is clicked
  clickHandler: function(place) {
    var plc = place || this;

    // Call for data
    app.wiki.getWiki(plc);
    app.foursquare.findPlace(plc);

    // Handle map actions
    app.map.infoWindow.close();
    if (app.viewmodel.drawerOpen()) {
      app.viewmodel.toggleDrawer();
    }
    app.viewmodel.setCurrentPlace(plc);
    app.viewmodel.toggleBounce();

    // Timeout to avoid two calls from success callbacks
    setTimeout(function() {
      app.viewmodel.setInfoWindow(plc);
    }, 300);
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
          return name.indexOf(input) === 0;
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
    }, 100);

    // Must return true to allow default behavior (Filling the input box)
    return true;
  },

  resetFilter: function() {
    app.viewmodel.inputText('');
    $('#drawer-top input').trigger('input');
  },

  setInfoWindow: function(place) {
    var content = $('#infowindow').html();

    app.map.infoWindow.setContent(content);
    app.map.infoWindow.open(app.map.map, place.marker);
    // Hide the drawer button while infowindow is open
    app.viewmodel.infoWindow(true);
  },

  // Strictly view related (create a separate file if there is more)
  toggleBounce: function() {
    if (app.viewmodel.curPlace().marker.getAnimation()) {
      app.viewmodel.curPlace().marker.setAnimation(null);
    } else {
      var marker = app.viewmodel.curPlace().marker;
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  },

  toggleDrawer: function() {
    app.viewmodel.drawerOpen(!app.viewmodel.drawerOpen());
  },

  setModal: function() {
    app.viewmodel.showModal(!app.viewmodel.showModal());
  },
};
