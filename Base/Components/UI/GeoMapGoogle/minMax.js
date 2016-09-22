/**
 * Created by nikita on 02.09.16.
 */

module.exports = function(value, min, max) {
  if(value > max)
    return max;
  else if (value < min)
    return min;

  return value
}
