// Where functions that affect display live
app.view = app.view || {};

app.view = {
  toggleDrawer: function() {
    $(els).toggleClass('closed open');
  },

  closeDrawer: function() {
    if($(els).hasClass('open'))
      this.toggleDrawer();
  }

};

var els = document.getElementsByClassName('drawer');

var button = document.getElementById('drawer-btn');
var mapButton = document.getElementById('map-btn');

button.addEventListener('click', app.view.toggleDrawer);
mapButton.addEventListener('click', app.view.toggleDrawer);

