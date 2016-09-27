/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// QUOKKA 2016
// By Ivan Kubota on 19.08.16.

module.exports = (function () {
    'use strict';
    var DOM = require('./DOMTools');

    var KB = function (layer) {
        this.layer = layer;
    };
    KB.prototype = {
        on: function(cfg){
            var i, keyCode = DOM.keyCode, map = {},
                elseFns = {},
                _self = this;

            for(i in cfg){
                map[keyCode[i]] = cfg[i];
            }
            this.layer.keydown = function(e){
                var what = map[e.which];

                if(what)
                    return what.call(_self.layer.owner, e);

                //e.preventDefault();
            };

        }
    };
    return KB;
})();