/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 25.08.16.

module.exports = (function () {
    'use strict';
    var QObject = require('../../Base/QObject'),
        console = QObject.console('compile');
    QObject.logging('compile');
    var CompileClass = require('./CompileClass');
    var CompileScope = function(cfg){
        this.children = [];
        this.classes = [];
        this.vars = {_known: 'QObject._knownComponents', cls: void 0, out: '{}'};
        QObject.apply(this, cfg);
        console.log('new compile scope');
    };
    
    CompileScope.prototype = {
        cls: function(cfg){
            if(typeof cfg !== 'object') {
                console.log('compiling class named '+cfg);
                cfg = {type: cfg || 'this'};
            }else{
                console.log('compiling class named '+cfg.name);
            }
            
            cfg.console = console;
            cfg.parentClass = this;
            var cls = new CompileClass(cfg, this);
            cls.root = cls;
            
            this.classes.push(cls);
            return cls;
        }
    };
    return CompileScope;
})();
