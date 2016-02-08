/* global app jQuery */
app.foursquare = app.foursquare || {};

(function() {
  // TODO: Move this to a config file (keep out of git)
  var CLIENTID = 'ZBGAM3NOJCK4P345ELK2JIB232FMDENJ05GXYQRSAHOHURJR';
  var CLIENTSECRET = 'RGEF2DNONIR0AN2GHSIIMGZWLT0IH5JSJCJ5AGFAJ2WZDGLH';

  app.foursquare = {
    findPlace: function(place) {
      console.log('FourSquare findPlace'); // REMOVE
      var loc = place.data.geometry.location;
      // Call the foursquare API
      jQuery.ajax({
        url: 'https://api.foursquare.com/v2/venues/search',
        data: {
          query: place.name(),
          ll: loc.lat() + ',' + loc.lng(),
          client_id: CLIENTID,
          client_secret: CLIENTSECRET,
          v: '20140806',
          limit: '1'
        },
        dataType: 'json',

        success: function(data) {
          var venue = data.response.venues[0];
          var info = ko.mapping.fromJS(venue, app.viewmodel.FourSquare);

          place.frSqrInfo(info);
          // app.viewmodel.setInfoWindow(place); // REMOVE ?
          console.log('Finished FourSquare'); // REMOVE
        },

        fail: function() {
          // TODO: Write this function
        },

        error: function() {
          // TODO: Write this function
        }
      });
    }
    // TODO: Should there be a return obect here (Module thinking>>>)
    // Would require a variable that indicates doneness?
  };
})();
