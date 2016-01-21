/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // Check to see if there's an updated version of service-worker.js with
      // new files to cache:
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-update-method
      if (typeof registration.update === 'function') {
        registration.update();
      }

      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }
})();

// My javascript code
// IIFE concept from https://addyosmani.com/blog/essential-js-namespacing/
(function(googleMap, undefined) {
  'use strict';

  var map;
  var placesApi;
  var okay;
  googleMap.places = ko.observableArray();

  googleMap.init = function() {
    var home = {lat: 39.927677, lng: -75.171909};
    var el = document.getElementById('map-container');

    map = new google.maps.Map(el, {
      center: home,
      zoom: 15,
      minZoom: 13,
      maxZoom: 18
    });

    placesApi = new google.maps.places.PlacesService(map);
    okay = google.maps.places.PlacesServiceStatus.OK;

    // // When 'bounds' are avaialable, call 'getPlaces()'
    google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
      getPlaces(map.getBounds());
      console.log('bounds changed');
    });
  };

  googleMap.getPlaceDetails = function() {

  };

  // Fill the places array that will be filtered with knockout
  function getPlaces(bounds) {
    var request = {
      bounds: bounds,
      types: ['restaurant']
    }
    placesApi.nearbySearch(request, function(array, status, page) {
      if (status === okay) {
        array.forEach(function(place) {
          googleMap.places.push(place);
        });
      } else {
        alert('There seems to be a problem with Google Maps, ' +
              'please try again later');
      }
    });
  };

  // Does this need to be public for knockout?
  function createMarkers() {

  };

  ko.applyBindings(googleMap);
})(window.googleMap = window.googleMap || {});

//   var Map = {


//     getPlaceDetails: function() {

//     },

//     createMarker: function(place) {
//       // var marker = new google.maps.Marker({
//       //   map: map,
//       //   position: ,
//       //   place: ,
//       //   icon: ,
//       //   animation: 'drop',
//       //   attribution: 'Mark\'s Udacity Project',
//       //   label: ,
//       //   title:  // Rollover Text
//       // });

//     }
//   };

//   // ko.applyBindings(Map);
// })();
