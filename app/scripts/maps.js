// TODO: Add powered by google logo

// All function related to Google Maps go here
(function() {
  'use strict';

  var map, bounds, infowindow;

  window.initMap = function() {
    var home = new google.maps.LatLng(39.927677, -75.171909);
    var el = document.getElementById('map-container');
    map = new google.maps.Map(el, {
      center: home,
      zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    google.maps.event.addDomListener(window, 'load', getPlaces);
  }

  function getPlaces() {
    bounds = map.getBounds();
    var request = {
      bounds: bounds,
      types: ['restaurant']
    };

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, getPlaceDetails);
  }

  function getPlaceDetails(results, status) {
    var service = new google.maps.places.PlacesService(map);

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        service.getDetails({ placeId: place.place_id }, placeMarkers);
      };
    }
  }

  function placeMarkers(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      createMarker(place);
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      // The map the marker gets added to
      map: map,
      // Location of the marker
      position: placeLoc,
      // Get the icon from the places API
      icon: place.icon,
      place: {
        location: place.geometry.location,
        placeId: place.place_id
      }
    });
      // console.log(place.place_id);
    var info = createInfoWindow(place);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(info);
        infowindow.open(map, this);
    });
  }

  function createInfoWindow(place) {
    var container = document.createElement('div');
    var title = document.createElement('h3');
    var phoneNum = document.createElement('h4');
    var website = document.createElement('h4');
    var sitelink = document.createElement('a');
    var address = document.createElement('h5');
    var pic = document.createElement('img');

    container.setAttribute('id', 'info-window');
    sitelink.setAttribute('href', place.website);

    title.innerText = place.name || '';
    phoneNum.innerText = place.formatted_phone_number || '';
    sitelink.innerText = place.website || '';
    address.innerText = place.formatted_address || '';

    container.appendChild(title);
    container.appendChild(phoneNum);
    website.appendChild(sitelink);
    container.appendChild(website);
    container.appendChild(address);

    if (place.photos) {
      pic.setAttribute( 'src', place.photos[0].getUrl({'maxWidth': 250}) );
      container.appendChild( pic );
    }

    return container;
  }
})();

