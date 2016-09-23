/**
 * Created by nikita on 30.08.16.
 */

module.exports = function (num) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var ind = num % alphabet.length;
    var t = Math.floor(num / alphabet.length);

    var ret = '';
    while (t >= 0) {
        ret += alphabet[ind];
        t--;
    }

    return ret;
}
