/**
 * Created by nikita on 30.08.16.
 */

module.exports = function(num) {
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var ind = num % alphabet.length;

  return alphabet[ind];
}
