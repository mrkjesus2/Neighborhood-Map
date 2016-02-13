/* global app jQuery ko */
app.foursquare = app.foursquare || {};

(function() {
  // TODO: Move this to a config file (keep out of git)
  var CLIENTID = 'ZBGAM3NOJCK4P345ELK2JIB232FMDENJ05GXYQRSAHOHURJR';
  var CLIENTSECRET = 'RGEF2DNONIR0AN2GHSIIMGZWLT0IH5JSJCJ5AGFAJ2WZDGLH';

  app.foursquare = {
    baseUrl: 'https://api.foursquare.com/v2/venues/',
    version: '20140806',

    findPlace: function(place) {
      // console.log('FourSquare findPlace'); // REMOVE
      var loc = place.data.geometry.location;
      // Call the foursquare API
      jQuery.ajax({
        url: this.baseUrl + 'search',
        data: {
          query: place.name(),
          ll: loc.lat() + ',' + loc.lng(),
          // Disabled lines due to API requirements
          client_id: CLIENTID, // eslint-disable-line camelcase
          client_secret: CLIENTSECRET, // eslint-disable-line camelcase
          v: this.version,
          limit: '1'
        },
        dataType: 'json'

      }).done(function(data) {
        // Best matching venue
        var venue = data.response.venues[0];

        // Callback the API for venue details
        app.foursquare.getVenueDetails(venue.id, place);
        // console.log('Finished FourSquare'); // REMOVE
      }).fail(function(data) {
        var msg = 'Foursquare Error: ' + data.statusText;
        app.viewmodel.addError(msg);
      });
    },

    getVenueDetails: function(venue, place) {
      jQuery.ajax({
        url: this.baseUrl + venue,
        data: {
          // Disabled lines due to API requirements
          client_id: CLIENTID, // eslint-disable-line camelcase
          client_secret: CLIENTSECRET, // eslint-disable-line camelcase
          v: this.version
        },
        dataType: 'json'
      }).done(function(data) {
        var details = data.response.venue;
        var map = ko.mapping.fromJS(details, app.viewmodel.FourSquare);
        // Assign details to place
        place.frSqrInfo(map);
      }).fail(function(data) {
        var msg = 'Foursquare Error: ' + data.statusText;
        app.viewmodel.addError(msg);
      });
    }
    // TODO: Should there be a return obect here (Module thinking>>>)
    // Would require a variable that indicates doneness?
  };
})();
