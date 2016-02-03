// Where functions that affect display live
app.view = app.view || {};

app.view = {
  toggleDrawer: function() {
    if (drawer.className === 'closed'){
      // drawer.style.transform = 'translateX(75%)';
      drawer.className = 'open';
      button.className = 'open';
      for (var i = 0; i < icon.length; i++) {
        icon[i].className = 'btn-icon open';
      };
    } else {
      drawer.className = 'closed';
      button.className = 'closed'
      for (var i = 0; i < icon.length; i++) {
        icon[i].className = 'btn-icon closed';
      };
    }
  },

  closeDrawer: function() {
    // TODO: Write this function
  },

  liSelect: function() {
    // TODO: Write this function
  }
};


var drawer = document.getElementById('drawer-container');
var button = document.getElementById('drawer-btn');
var icon = document.getElementsByClassName('btn-icon');
button.addEventListener('click', app.view.toggleDrawer);
