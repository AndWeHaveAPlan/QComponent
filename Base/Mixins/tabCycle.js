/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// Copyright by Ivan Kubota. 9/17/2016
module.exports = (function () {
    'use strict';
    var QObject = require('../QObject'),
        Property = require('../Property'),
        DOMTools = require('../Common/UI/DOMTools'),
        Keyboard = require('../Common/UI/Keyboard'),
        UIEventManager = require('../Common/UIEventManager'),
        console = QObject.console('tabCycle');
    QObject.logging('tabCycle');

    return QObject.mixin('tabCycle', {
        _init: function () {
            var _self = this;
            
            this.tabCycleList = [];
            
            this.on('_bubbleProtocol', function(cfg){
                console.log(cfg, cfg.me.id);
                if(cfg.type === 'tab'){
                    // one of possible solutions
                    var list = [];
                    _self.spread('focusable', {items: list});
                    list = QObject.sort.guaranteed(list, function (item) {
                        return item._data.tabIndex;
                    });
                    var i = list.indexOf(cfg.me),
                        next = ((i + cfg.direction)+list.length) % list.length;

                    if(list[next].focus()!==false){
                        //_self.set('ActiveElement', list[next]);
                    }
                    return false;
                }else if(cfg.type === 'focus'){
                    _self.set('ActiveElement', cfg.me);
                }

            });
        },
        addTabbableItem: function (item) {
            this.tabElementList.push(item);
        },
        removeTabbableItem: function (item) {
            
        },
        _prop: {
            ActiveElement: new Property('input')
        }
    });
})();