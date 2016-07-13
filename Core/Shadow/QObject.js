/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function() {
    'use strict';
    return {
        /*using: ['Date', 'Number'],
        public: {
            name: {type: 'String', value: '234ewt', description: ''},
            olo: {type: 'Function', }
        },*/
        argumentParser: function (item) {
            var tokens = item.split(':');
            return {name: tokens[0].trim(), value: tokens[1]};
        }
    };
})();
    
