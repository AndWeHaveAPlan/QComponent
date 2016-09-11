/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 11.09.16.
module.exports = (function () {
    'use strict';

    var assert = require('chai').assert,
        compile = require('./common/compileQS'),
        fs = require('fs');


    /*describe('test1', function () {
        it('should create input with type number', function (done) {
            compile(
                'def Page main',
                '  input i1: 10',
                '    type: number',
                '  input i2: {{Math.sin(i1)}}',

                function (err, main) {
                    assert.equal(main.findOne('#i2').get('value'), Math.sin(10));
                    done();
                });
        });
    });*/
    describe('test1', function () {
        it('should create input with type number', function (done) {
            compile(
                'def Page main',
                '  GeoMap g1',
                //'    .click: (e)->g1.makeRoute(17);',
                '    .unclick: (e)->g1.home.push(2)',

                function (err, main) {
                  //  assert.equal(main.findOne('#g1').eventList.click.list[0].fn.toString(), 'function (e){\ng1.makeRoute(17);\n}');
                    assert.equal(main.findOne('#g1').eventList.unclick.list[0].fn.toString(), 'function (e){\ng1.get(\'home\').push(17);\n}');
                    done();
                });
        });
    });
})();