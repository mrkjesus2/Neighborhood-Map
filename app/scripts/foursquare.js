/* global app jQuery ko */
app.foursquare = app.foursquare || {};

(function() {
  // TODO: Move this to a config file (keep out of git)
  var CLIENTID = 'ZBGAM3NOJCK4P345ELK2JIB232FMDENJ05GXYQRSAHOHURJR';
  var CLIENTSECRET = 'RGEF2DNONIR0AN2GHSIIMGZWLT0IH5JSJCJ5AGFAJ2WZDGLH';

  app.foursquare = {
    findPlace: function(place) {
      // console.log('FourSquare findPlace'); // REMOVE
      var loc = place.data.geometry.location;
      // Call the foursquare API
      jQuery.ajax({
        url: 'https://api.foursquare.com/v2/venues/serch',
        data: {
          query: place.name(),
          ll: loc.lat() + ',' + loc.lng(),
          // Disabled lines due to API requirements
          client_id: CLIENTID, // eslint-disable-line camelcase
          client_secret: CLIENTSECRET, // eslint-disable-line camelcase
          v: '20140806',
          limit: '1'
        },
        dataType: 'json'

      }).done(function(data) {
        console.log('Foursquare done');
        var venue = data.response.venues[0];
        var info = ko.mapping.fromJS(venue, app.viewmodel.FourSquare);

        place.frSqrInfo(info);

        // console.log('Finished FourSquare'); // REMOVE
      }).fail(function(data) {
        var msg = 'Foursquare Error: ' + data.statusText;
        app.viewmodel.addError(msg);
      });
    }
    // TODO: Should there be a return obect here (Module thinking>>>)
    // Would require a variable that indicates doneness?
  };
})();
