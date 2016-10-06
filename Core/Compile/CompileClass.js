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
        uuid = require('tiny-uuid'),
        CompilationChild = require('./CompileChild');
    
    var CompileClass = function(cfg, scope){
        this.scope = scope;
        this.props = [];
        this.childItems = [];
        this.subClasses = [];
        QObject.apply(this, cfg);
        var type = this.type;
        if(!this.root)
            this.root = this;
        var metadata = scope.metadata[type];

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
        subcls: function(cfg){
            if(typeof cfg !== 'object')
                cfg = {type: cfg || 'this'}

            cfg.root = this.root || this;
            cfg.parentClass = this;
            var cls = new CompileClass(cfg, this.root.scope);
            this.subClasses.push(cls);
            return cls;
        },
        child: function(cfg){
            cfg.root = this.root || this;
            cfg.parentClass = this;
            var child = new CompilationChild(cfg, this.root.scope);
            this.childItems.push(child);
            return child;
        },
        compile: function (inline) {

            var vars = this.vars,
                name = this.type,
                scope = this.scope;

            var metadataItem = this.metadata,
                source,
                _self = this,
                children;

            inline = !!inline;

            if (inline) {
                if(!metadataItem) {
                    throw new Error(this.name + ' <'+ name +'> has no metadata');
                }
                this.type = name = metadataItem._type + uuid();
            }

            this.root.scope.vars[metadataItem._type] = '_known[\'' + metadataItem._type + '\']';

            this._knownVars = [];
            for (var key in metadataItem.private) {
                if (metadataItem.private.hasOwnProperty(key)) {
                    if (!metadataItem.private[key].children)
                        this._knownVars.push(key);
                }
            }

            var out = '';

            var props = [
                //{name: 'value', value: 'new Base.Property("Variant")'}
            ];

            for (var p in this.metadata.private)
                if (this.metadata.private.hasOwnProperty(p)) {
                    console.log('p')
                    console.log(p)
                    if (this.metadata.private[p].type === 'Function') {
                        props.push({ name: p, value: 'new Base.Property("Function")' });
                    }
                }
            
            children = this.children || metadataItem.children;
            var compiledChildren = children ? children.map(function (el) {
                return _self.child({cls: _self, child: el, parent: _self});//el, item, props, vars, 0);
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
                metadataItem.events ? tools.builder.events(metadataItem, _self).join('\n') : '',
                '',
                out,
                this.makePublic(metadataItem.public, metadataItem, scope),
                this.makePublic(metadataItem.private, metadataItem, scope),
                compiledChildren,
                //'    this._init();',
                '})' + (inline ? '' : ';')
            ];
            return tools.indent(1, source);
        },
        makePublic: function (props, def, scope) {
            var i, prop, pipes, out = '', propVal;
            for (i in props) {
                prop = props[i];
                pipes = prop.value;

                if (pipes && pipes.isPipe) {
                    out += tools.makePipe(pipes, this, this.scope,this, prop, true, def);
                } else {

                    propVal = tools.propertyGetter(prop, scope, scope.vars, this);//vars);

                    //console.log(i,propVal, JSON.stringify(prop));
                    if(!(propVal instanceof Error) && propVal!=='')
                        out += '\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }
            return out;
        }
    };
    return CompileClass;
})();