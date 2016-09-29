/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */;// QUOKKA 2016
// By Ivan Kubota on 19.08.16.

module.exports = (function () {
    'use strict';
    var DOM = require('./DOMTools');
    var KeyboardEvent = function(e){
        this._originalEvent = e;
        this.which = e.which;
        this.key = e.key;
        this.keyCode = e.keyCode;
        this.shift = e.shiftKey;
        this.meta = e.keyCode === 91 || //meta/win/command/super
            e.keyCode === 18 || e.metaKey;

        this.ctrl = e.ctrlKey; //ctrl
        this.code = e.keyCode;
    };
    KeyboardEvent.prototype = {
        which: null,
        key: null,
        shift: false,
        meta: false,
        ctrl: false,
        cancel: function(){
            this._originalEvent.preventDefault();
            this._originalEvent.stopPropagation();
        },
        keys: {
            backspace: 8,
            comma: 188,
            'delete': 46,
            'del': 46,
            down: 40,
            end: 35,
            enter: 13,
            escape: 27,
            home: 36,
            left: 37,
            numpad_add: 107,
            numpad_decimal: 110,
            numpad_divide: 111,
            numpad_enter: 108,
            numpad_multiply: 106,
            numpad_subtract: 109,
            page_down: 34,
            page_up: 33,
            period: 190,
            right: 39,
            space: 32,
            tab: 9,
            up: 38,
            any: -1
        }
    };

    var KB = function (layer) {
        this.layer = layer;
        this.elseFns = {};
    };

    KB.prototype = {
        on: function(cfg){
            var i, keyCode = DOM.keyCode, map = {},
                _self = this;

            for(i in cfg){
                map[keyCode[i]] = cfg[i];
            }
            this.layer.keydown = function(e){
                var wE = new KeyboardEvent(e),
                    what = map[wE.which], result;

                if(what) {
                    result = what.call(_self.layer.owner, wE);
                    if(result !== false) {
                        wE.cancel();
                        return result;
                    }
                }
                _self.elseFns.keydown && _self.elseFns.keydown(wE);


            };
            this.layer.keyup = function(e){
                _self.elseFns.keyup && _self.elseFns.keyup(new KeyboardEvent(e));
            };
            this.layer.keypress = function(e){
                _self.elseFns.keypress && _self.elseFns.keypress(new KeyboardEvent(e));
            };
        },
        defaultSubscriber: function(who){
            this.elseFns.keydown = function(e){
                var todo = {}, i, cancel, scope = 'Chars';
                if(e.ctrl){
                    scope = 'Words';
                }

                if (e.keyCode === e.keys.backspace)
                    todo['_remove'+ scope] = -1;

                if (e.keyCode === e.keys.delete)
                    todo['_remove'+ scope] = 1;

                if(e.keyCode === e.keys.left)
                    todo['_moveCursor'+ scope] = -1;

                if(e.keyCode === e.keys.right)
                    todo['_moveCursor'+ scope] = 1;

                for(i in todo) {
                    who[i](todo[i]);
                    cancel = true;
                }
                if(cancel)
                    e.cancel();

            };
            this.elseFns.keypress = function(e){
                who._addKey(e);
            };
        }
    };
    return KB;
})();