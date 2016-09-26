/**
 * Created by nikita on 30.08.16.
 */

function createTextMarker(options) {
  var position = options.position;
  var map   = options.map;
  var label = options.label || '';
  var text  = options.text || '';

  var marker = new google.maps.Marker({
    position: position,
    map: map,
    label: label
  });

  var label = new MapLabel({
    position: position,
    map: map,
    text: text
  });

  return {
    marker: marker,
    label: label
  }
}

function removeTextMarker(textMarker) {
  textMarker.marker.setMap(null);
  textMarker.label.setMap(null);
}

module.exports = {
  create : createTextMarker,
  remove : removeTextMarker
}
