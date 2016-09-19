/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 11.09.16.

module.exports = (function () {
    'use strict';
    var jsdom = require('jsdom');
    var Base = require('../../Base');
    var Core = require('../../Core'),
        QObject = Base.QObject,
        fs = require('fs'),
        bundle = fs.readFileSync('public/bundle.js')+'';
    
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
        var doc = QObject.document =
            QObject.prototype.document =
                Base.Component.UIComponent.document =
                    Base.Component.AbstractComponent.document =
                    jsdom.jsdom();
        try {
            var test = new Function('document, Base', 'QObject = Base.QObject; Q = ' + compiled + '; return Q;');
            var Q = test(doc, Base);
            var main = new Q.main();
        }catch(e){
            err = e;
            console.log(e)
            console.log(compiled)

        }


        setTimeout(function(){
            cb(err, main, compiled);
        }, 5);
    }
    return compile;
})();