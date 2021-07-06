$(function(){
  var map = L.map('mapdiv', {
    minZoom: 6,
    maxZoom: 18,
  });
  var layer = L.tileLayer(
    'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
       opacity: 0.6,
       attribution: '<a href="http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html" target="_blank">国土地理院</a>'
  });

  layer.addTo(map);

  $.getJSON( 'poi.geojson', function(data) {
    var poiLayer = L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
        }).bindPopup(
          function() {
            tr = '<table border>';
            Object.keys(feature.properties).forEach( function(k){
              tr = tr + 
                   '<tr><td style="white-space: nowrap;">' + 
                   k + 
                   '</td><td style="white-space: nowrap;">' +
                   feature.properties[k] + 
                   '</td></tr>';
            });
            return tr + '</table>';
          }
        );
      }
    }).addTo(map);

    map.fitBounds(poiLayer.getBounds());
  });

  L.easyButton('fa fa-info fa-lg',
    function() {
      $('#about').modal('show');
    },
    'このサイトについて',
    null, {
      position:  'bottomright'
    }).addTo(map);

});
