app.FourSquare = app.FourSquare || {};

var CLIENTID = 'ZBGAM3NOJCK4P345ELK2JIB232FMDENJ05GXYQRSAHOHURJR';
var CLIENTSECRET = 'RGEF2DNONIR0AN2GHSIIMGZWLT0IH5JSJCJ5AGFAJ2WZDGLH';

app.FourSquare = {
  base: 'https://api.foursquare.com/v2/venues/search?',
  client: '&client_id=' + CLIENTID + '&client_secret=' + CLIENTSECRET,
  vers: '&v=20140806',
  limit: '&limit=2',

  findPlace: function(query, lat, lng, i) {
    console.log('Searching Foursquare');
    var query = '&query=' + query;
    var loc = 'll=' + lat + ',' + lng;
    var url = this.base + loc + this.client + this.vers + this.limit + query;
    // console.log('Finding foursquare place');
    jQuery.get(url, function(data) {
        var venue = data.response.venues[0];
        console.log(i + ': ', venue);
      });
  }

};
