/**
 * Created by nikita on 29.08.16.
 */

module.exports = function(arr) {
  // It doesnt work in MapLabel because 'lat' and 'lng' should be function
  //
  // return { lat: arr[0], lng: arr[1] };

  // new google.maps.LatLng(-34, 151)
  return new google.maps.LatLng(arr[0], arr[1], 10e-7);
}
