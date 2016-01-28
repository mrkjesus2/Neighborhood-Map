app.FourSquare = app.FourSquare || {};

// TODO: Move this to a config file (keep out of git)
var CLIENTID = 'ZBGAM3NOJCK4P345ELK2JIB232FMDENJ05GXYQRSAHOHURJR';
var CLIENTSECRET = 'RGEF2DNONIR0AN2GHSIIMGZWLT0IH5JSJCJ5AGFAJ2WZDGLH';

app.FourSquare = {
  // Paramaters needed for the query
  base: 'https://api.foursquare.com/v2/venues/search?',
  client: '&client_id=' + CLIENTID + '&client_secret=' + CLIENTSECRET,
  vers: '&v=20140806',
  limit: '&limit=2',

  findPlace: function(query, lat, lng) {
    // More Parameters needed for the query
    var search = '&query=' + query;
    var loc = 'll=' + lat + ',' + lng;
    var url = this.base + loc + this.client + this.vers + this.limit + search;
    // Call the foursquare API
    jQuery.get(url, function(data) {
      var venue = data.response.venues[0];
      // TDOD: Handle the Foursquare data
      console.log(venue);
    });
  }

};
