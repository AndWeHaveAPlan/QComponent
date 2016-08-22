/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 22.08.16.
// Образцовопоказательный тест
module.exports = (function () {
    'use strict';
    var Base = require('../Base');
    var assert = require('chai').assert;
    var jsdom = require('jsdom');
    var Core = require('../Core'),
        QObject = Base.QObject,
        fs = require('fs'),
        bundle = fs.readFileSync('public/bundle.js')+'';


    describe('test1', function(){
        //jsdom();
        it('should create input', function (done) {
            var x = compile(
                'def Page main\n' +
                '  input i1: 10\n' +
                '    type: number\n', function(err, main){
                    console.log(typeof main.find('input')[0].get('value'));
                    done();
                });

        });
    });


    function compile(code, cb){
        var p = new Core.Compile.Linker({
            mapping: {
                id: 'id',
                code: 'code'
            }
        });
        var obj = p.add({
            id: 'test',
            code: code
        });
        var meta = p.getMetadata(),
            subObj = {},
            compiled;
        console.log('metadata extracted');
        for (var i in meta) {
            meta[i] && meta[i].type && (subObj[i] = meta[i]);
        }
        compiled = Core.Compile.Compiler.compile(subObj);

        var doc = QObject.document = QObject.prototype.document = jsdom.jsdom();
        var test = new Function('document, Base', 'QObject = Base.QObject; Q = '+compiled+'; return Q;');
        var Q = test(doc, Base);

        //console.log(QObject.document.body.innerHTML)
        var main = new Q.main(),
            err = false;
        setTimeout(function(){
            cb(err, main);
        }, 5);
    }
})();