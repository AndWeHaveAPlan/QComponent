/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 9/16/16.

module.exports = (function () {
    'use strict';
    var QObject = require('../../QObject');

    return QObject._knownComponents['span'].extend('Label', {});
})();