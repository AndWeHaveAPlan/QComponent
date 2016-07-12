/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function() {
    'use strict';
    return {
        argumentParser: function (item) {
            var tokens = item.split(':');
            return {name: tokens[0].trim(), value: tokens[1]};
        }
    };
})();