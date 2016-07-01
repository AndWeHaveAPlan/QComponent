/**
 * Created by ravenor on 01.07.16.
 */

module.exports = {
    odd: function (a) {
        return a % 2 === 0;
    },

    even: function (a) {
        return a % 2 !== 0;
    },

    validEmail: function (email) {
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return re.test(email);
        }
    }
};