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
        /*it('should compile slider.qs', function (done) {
            compile(
                fs.readFileSync('public/slider.qs'),

                function(err, main){
                    assert.equal(typeof main.find('input')[0].get('value'), 'number');

                    main.find('input')[0].set('value', '42');
                    assert.equal(typeof main.find('input')[0].get('value'), 'number');
                    assert.equal(main.find('input')[0].get('value'), 42);
                    done();
                });
        });*/

        /*
        it('should pipe different formats of array', function (done) {
            compile(
                'def Page main',
                '  Number m: 15',
                '  input i1: 10',
                '    scale: [\'{{m}}\', {{m}}]//comment',

                function(err, main){
                    assert.equal(
                        Array.isArray(main.find('input')[0].get('scale')),
                        true
                    );
                    done();
                });
        });
        it('pipe transform', function (done) {
         compile(
         'def Page main',
         '  input i0: 13',
         '    type: number',
         '  input i1: {{i0+2}}',
         '  input i2: {{i1+2}}',
         '  input i3: {{i2}}',
         '    type: number',
         '  input i4: {{i3+2}}',
         function(err, main){
         assert.equal(main.findOne('input#i4').get('value'), 154)
         done();
         });
         });*/
        it('pipes transformation', function (done) {
            compile(
                'def Page main',
                '  Number m: 2',
                '  String s1: value',
                '  Number n: {{i1[i2%2?\'type\':s1][i2[i2%2?\'type\':s1][5]].lal()+i1[i5]()+m+i1+i2.value+i1.type}}',
                '  input i1: 10',
                '    type: text',
                '  input i2: 10',
                '    type: number',
                function(err, main, compiled){
                    console.log(compiled);
                    /*var matched = compiled.match(/addMutator\([^(]*\(([^)]*)\)[^{]*\{([^}]*)\}/),
                        args = matched[1].split(','), body = matched[2];

                    console.log(args);
                    console.log(body.trim());
                    console.log('return var1+var2+var3+var4+var5;')*/
                    done();
                });
        });
        /*it('should extract function', function (done) {
            compile(
                'def Page main',
                '  Number m: 15',
                '  input i1: 10',
                '    .click: ()->{',
                '        input x = i1;',
                '        ',
                '//haha loh',
                'debugger;',
                '       m=((7))',
                '}',

                function(err, main){
                    var i = main.find('input')[0],
                        j = i.eventList.click.list[0].fn.toString();
                    console.log(j)

                    assert.equal(
                        Array.isArray(main.find('input')[0].get('scale')),
                        true
                    );
                    done();
                });
        });*/
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
            compiled,
            err = false;
        console.log('metadata extracted');
        for (i in meta) {
            meta[i] && meta[i].type && (subObj[i] = meta[i]);
        }
        compiled = Core.Compile.Compiler.compile(subObj);
//console.log(compiled)
        var doc = QObject.document = QObject.prototype.document = jsdom.jsdom();
        try {
            var test = new Function('document, Base', 'QObject = Base.QObject; Q = ' + compiled + '; return Q;');
            var Q = test(doc, Base);
            var main = new Q.main();
        }catch(e){
            err = e;
            console.log(e)

        }


        setTimeout(function(){
            cb(err, main, compiled);
        }, 5);
    }
})();