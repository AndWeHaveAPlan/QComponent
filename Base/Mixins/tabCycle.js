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
            this.tabCycleList = [];

        },
        addTabbableItem: function (item) {
            this.tabElementList.push(item);
        },
        removeTabbableItem: function (item) {

        }
    });
})();