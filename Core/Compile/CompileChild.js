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
    var tools = require('./CompileTools');
    
    var CompilationChild = function (cfg, scope) {
        this.scope = scope;
        QObject.apply(this, cfg);
        this.name = this.child.name;
        if (!this.child.name) {
            this.tmpName = this.child.tmpName = tools.getTmpName(this.child.type);
        }
    };
    CompilationChild.prototype = {
        nesting: 0,
        compile: function () {
            var child = this.child;

            var type = child.type,
                _self = this,
                propList,
                out = [],
                cfgInit = [],
                pipes = [],
                compiledChildren = [],
                events = [],
                name = this.name || this.tmpName;



            /** get outer knowledge about this child type from compiling metadata */
            propList = this.scope.metadata[type];

            if (!propList) { /** it is not in compiling classes */
                propList = QObject._knownComponents[type]; /** maybe it is in SDK components */
                if (!propList || !(propList.prototype instanceof QObject._knownComponents.AbstractComponent))
                    return ''; /** no it is not, or it is not a component */

                propList = propList.prototype; /** we need prototype */
            }

            /** compile subchildren */
            if (child.children) {
                compiledChildren = child.children.map(function (item) {
                    return _self.scope.child({
                        cls: _self.cls,
                        parent: _self,
                        child: item,
                        nesting: _self.nesting + 1
                    }).compile();
                });
            }

            var i, prop, propVal, pipe, 
                properties = child.prop = child.prop || {};
            
            if (child.value)
                properties.value = {
                    name: 'value',
                    type: tools.getPropertyType(propList, 'value') || 'Variant',
                    value: child.value
                };

            if (child.cls)
                properties.cls = {
                    name: 'cls',
                    type: tools.getPropertyType(propList, 'cls') || 'Variant',
                    value: child.cls
                };

            if (child.name) {
                this.cls.props.push({name: child.name, value: 'new Base.Property(\'' + child.type + '\')'});
            }

            for (i in child.prop) {

                prop = child.prop[i];
                pipe = prop.value;
                if (pipe.isPipe) {
                    pipes.push(tools.makePipe(pipe, child, this.scope, this.cls, prop, 'child', prop));//'self.id', i, this.cls, name + '.id', prop));
                } else {
                    propVal = tools.propertyGetter(prop, this.scope, this.scope.vars, this.cls);
                    cfgInit.push(tools.makeProp(i, propVal));
                }
            }

            //if (child.name)
                cfgInit.push('id: \'' + name + '\'');

            if (child.events)
                events = tools.builder.events(child, this.cls);

            var addToParent = '';
            if (this.nesting > 0) {
                addToParent = (this.parent.name || this.parent.tmpName) + '.addChild(' + name + ');\n';
                addToParent += 'eventManager.registerComponent(' + name + ');\n';
            } else {
                addToParent = 'this._ownComponents.push(' + name + ');\n';
            }
            addToParent += name + '.mainEventManager=eventManager;\n';

            out = [ '// ' + name,
                    '\nvar ' + name + ' = new _known[\'' + child.type + '\']({' +
                tools.indent(1, cfgInit).join(',\n'), '\n});\n',

                addToParent,

                '\n// children of ' + name + '\n',
                tools.indent(1, compiledChildren.join(';\n')),

                '\n// pipes of ' + name + '\n',
                pipes.join('\n'),

                '\n// events of ' + name + '\n',
                events.join('\n'),

                '\n\n'];

            if (child.name) {
                out.push('this.set(\'' + child.name + '\', ' + child.name + ')');
            }

            return out.join('\n');
        }
    };
    
    return CompilationChild;
})();