/* global app jQuery document */
app.Wiki = app.Wiki || {};

(function() {
  app.Wiki = {
    getWiki: function(place) {
      jQuery.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {
          action: 'query',
          prop: 'categories|extracts',
          exintro: '',
          format: 'json',
          redirects: '',
          converttitles: '',
          titles: place
        },
        dataType: 'jsonp',
        headers: {'Api-User-Agent': 'Mark\'s Udacity Project'},

        success: function(data) {
          // console.log(data);
          var firstId = Object.keys(data.query.pages)['0'];
          var pageContent = data.query.pages[firstId].extract;
          var container = document.getElementById('wiki-container');

          // TODO: Change to the appropriate container
          if (pageContent === undefined ||
              app.Wiki.ambiguityChk(data, firstId)) {
            container.innerHTML = '';
          } else {
            container.innerHTML = pageContent;
          }
          console.log('Finished getWiki');
        }
      });
    },

    ambiguityChk: function(data, id) {
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
