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
        /*it('should create input with type number', function (done) {
            compile(
                'def Page main',
                '  input i1: 10',
                '    type: number',

                function(err, main){
                assert.equal(typeof main.find('input')[0].get('value'), 'number');

                main.find('input')[0].set('value', '42');
                assert.equal(typeof main.find('input')[0].get('value'), 'number');
                assert.equal(main.find('input')[0].get('value'), 42);
                done();
            });
        });*/
        it('should pipe different formats of array', function (done) {
            compile(
                'def Page main',
                '  Number m: 15',
                '  input i1: 10',
                '    scale: [{{m}}, {{m}}]',

                function(err, main){
                    assert.equal(
                        Array.isArray(main.find('input')[0].get('scale')),
                        true
                    );
                    done();
                });
        });
    });


    function compile(){
        var code = [], arg, i, _i, cb;
        for( i = 0, _i = arguments.length; i < _i; i++){
            arg = arguments[i];
            if(typeof arg === 'function'){
                cb = arg;
                break;
            }
            code.push(arg);
        }
        code = code.join('\n');

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
        for (i in meta) {
            meta[i] && meta[i].type && (subObj[i] = meta[i]);
        }
        compiled = Core.Compile.Compiler.compile(subObj);
console.log(compiled)
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