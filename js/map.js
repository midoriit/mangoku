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
          icon: L.BeautifyIcon.icon({
            isAlphaNumericIcon: true,
            text: (function(feat){
              return (feat.properties['藩']).slice(0, 1);
            }(feature)),
            borderColor: (function(feat){
              if(feat.properties['石高'] > 500000) {
                return '#F00';
              } else if(feat.properties['石高'] > 100000) {
                return '#FC0';
              } else {
                return '#0F0';
              }
            }(feature))
          })
        }).bindPopup(
          function() {
            tr = '<table border>';
            Object.keys(feature.properties).forEach( function(k){
              var v = feature.properties[k];
              if( typeof(v) == 'number' ){
                tr = tr + 
                   '<tr><td style="white-space: nowrap;">' + 
                   k + 
                   '</td><td style="white-space: nowrap;">' +
                   v.toLocaleString() + 
                   '</td></tr>';
              } else if( typeof(v) == 'string' && v.indexOf('http') === 0) {
                tr = tr + 
                   '<tr><td style="white-space: nowrap;">' + 
                   k + 
                   '</td><td style="white-space: nowrap;">' +
                   '<a href="' + v + '" target="_blank">' + 
                   v + '</a>' +
                   '</td></tr>';
              } else {
                tr = tr + 
                   '<tr><td style="white-space: nowrap;">' + 
                   k + 
                   '</td><td style="white-space: nowrap;">' +
                   v + 
                   '</td></tr>';
              }
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
