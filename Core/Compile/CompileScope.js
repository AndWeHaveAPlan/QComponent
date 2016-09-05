/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 25.08.16.

module.exports = (function () {
    'use strict';
    var QObject = require('../../Base/QObject');
    var CompilationChild = require('./CompileChild');
    var CompileClass = require('./CompileClass');
    var CompileScope = function(cfg){
        this.children = [];
        this.classes = [];
        this.vars = {_known: 'QObject._knownComponents', cls: void 0, out: '{}'};
        QObject.apply(this, cfg);        
    };
    
    CompileScope.prototype = {
        child: function(cfg){
            var child = new CompilationChild(cfg, this);
            this.children.push(child);
            return child;
        },
        cls: function(name){
            var cls = new CompileClass(typeof name === 'object' ? name : {type: name || 'this'}, this);
            this.classes.push(cls);
            return cls;
        }
    };
    return CompileScope;
})();
