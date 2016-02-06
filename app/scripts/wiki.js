/* global app jQuery */
app.wiki = app.wiki || {};

(function() {
  app.wiki = {
    getWiki: function(place) {
      console.log('Wiki getWiki'); // REMOVE
      jQuery.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
          action: 'query',
          prop: 'categories|extracts|info',
          exintro: '',
          exchars: 1000,
          inprop: 'url',
          format: 'json',
          redirects: '',
          converttitles: '',
          titles: place.name()
        },
        dataType: 'jsonp',
        headers: {'Api-User-Agent': 'Mark\'s Udacity Project'},

        success: function(data) {
          var firstId = Object.keys(data.query.pages)['0'];
          var page = new app.viewmodel.WikiPage(data.query.pages[firstId]);

          // Check to make sure there is worthwhile content
          if (page.content() !== undefined && !app.wiki.ambiguityChk(data, firstId)) {
            place.wikiInfo(page);
            // app.viewmodel.setInfoWindow(place); // REMOVE ?
          }
          console.log('Finished getWiki'); // REMOVE
        },

        fail: function() {
          // TODO: Write this function
        },

        error: function() {
          // TODO: Write this function
        }

      });
    },

    // Check for a disambiguity page (no info - only links)
    ambiguityChk: function(data, id) {
      console.log('Wiki ambiguityChk'); // REMOVE
      var categories = data.query.pages[id].categories;

      for (var category in categories) {
        if (categories[category].title ===
          'Category:All article disambiguation pages') {
          return true;
        }
        return false;
      }
    }
  };
})();
