/**
 * Created by ravenor on 18.08.16.
 */

module.exports = {
    check: function (number) {
        var strNumber = number.toString();

        var i = 0;// strNumber % 2 == 0 ? 0 : 1;
        var oe = strNumber % 2 == 0 ? 0 : 1;
        var total = 0;

        for (i; i < strNumber.length; i++) {
            var cDigit = strNumber[i];

            if (i % 2 == oe) {
                var doubled = cDigit * 2;
                if (Number.isNaN(doubled))
                    return false;

                if (doubled > 9) {
                    doubled -= 9;
                }
                total += doubled;
            } else {
                total += cDigit * 1;
            }

        }
        return total % 10 == 0;
    }
};