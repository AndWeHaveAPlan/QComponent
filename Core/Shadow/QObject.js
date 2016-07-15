/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function() {
    'use strict';
    var tools = require('../Compile/tools');
    return {
        /*using: ['Date', 'Number'],
        public: {
            name: {type: 'String', value: '234ewt', description: ''},
            olo: {type: 'Function', }
        },*/
        argumentParser: function (text, item) {

            var splitted = tools.split(item.items, ':', 2);

            return {name: tools.detox(tools.trim(splitted[0])), value: tools.detox(tools.trim(splitted[1]), true)};

        }
    };
})();
    
