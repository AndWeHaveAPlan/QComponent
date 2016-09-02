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
    var tools = require('./CompileTools'),
        uuid = require('tiny-uuid');
    
    var CompileClass = function(cfg, scope){
        this.scope = scope;
        this.props = [];
        QObject.apply(this, cfg);
        var type = this.name;
        var metadata = this.scope.metadata[type];

        if (!metadata) { /** it is not in compiling classes */
            metadata = QObject._knownComponents[type]; /** maybe it is in SDK components */
            if (!metadata || !(metadata.prototype instanceof QObject._knownComponents.AbstractComponent))
                return ''; /** no it is not, or it is not a component */

            metadata = metadata.prototype; /** we need prototype */
            if(metadata._type){
                metadata._type = type;
            }

        }
        this.metadata = metadata;
        if(!metadata.type || !metadata._type)
            metadata.type = metadata._type = metadata._type || metadata.type;
    };
    CompileClass.prototype = {
        compile: function (inline) {

            var vars = this.vars,
                name = this.name,
                scope = this.scope;

            var metadataItem = this.metadata,
                source,
                _self = this;

            inline = !!inline;

            if (inline) {
                this.name = name = metadataItem._type + uuid();
            }

            this.scope.vars[metadataItem._type] = '_known[\'' + metadataItem._type + '\']';

            this._knownVars = [];
            for (var key in metadataItem.private) {
                if (metadataItem.private.hasOwnProperty(key)) {
                    if (!metadataItem.private[key].children)
                        this._knownVars.push(key);
                }
            }

            var out = '';

            var props = [
                {name: 'value', value: 'new Base.Property("Variant")'}
            ];

            var compiledChildren = metadataItem.children ? metadataItem.children.map(function (el) {
                return scope.child({cls: _self, child: el, parent: _self});//el, item, props, vars, 0);
            }) : '//no children\n';

            Array.isArray(compiledChildren) && (compiledChildren = compiledChildren.map(function(item){
                return item.compile();
            }).join(''));
            //debugger;
            source = [
                (inline ? '' : 'var ' + name + ' = out[\'' + name + '\'] = ' ) + metadataItem._type + '.extend(\'' + name + '\', {_prop: {' +
                props.map(function (item) {
                    return item.name + ': ' + item.value;
                }).join(',\n') +
                '}}, function(){',
                '    ' + metadataItem._type + '.apply(this, arguments);',
                '    var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;',
                metadataItem.events ? this.builder.events(metadataItem, _self) : '',
                '',
                out,
                this.makePublic(metadataItem.public, metadataItem, vars),
                this.makePublic(metadataItem.private, metadataItem, vars),
                compiledChildren,
                '    this._init();',
                '})' + (inline ? '' : ';')
            ];
            return tools.indent(1, source);
        },
        makePublic: function (props, def, vars) {
            var i, prop, pipes, out = '', propVal;
            for (i in props) {
                prop = props[i];
                pipes = prop.value;

                if (pipes && pipes.isPipe) {
                    out += tools.makePipe(pipes, this, this.scope,this, prop, true, def);//'clsMakePublic');//'this.id', i, def, 'this.id', prop);
                } else {

                    propVal = tools.propertyGetter(prop, vars);

                    //console.log(i,propVal, JSON.stringify(prop));
                    if(!(propVal instanceof Error))
                        out += '\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }
            return out;
        }
    };
    return CompileClass;
})();