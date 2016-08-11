/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function () {
    'use strict';
    var QObject = require('../../Base/QObject'),
        cmetadata = {};

    return new QObject({
        compile: function (metadata) {
            cmetadata = metadata;

            var source = [],
                vars = {_known: 'QObject._knownComponents', cls: void 0, out: '{}'},
                varDefs = [], i;

            for (i in metadata)
                source = source.concat(this.compileClass(metadata, i, vars));

            for (i in vars)
                varDefs.push(vars[i] === void 0 ? i : i + ' = ' + vars[i]);

            return '(function(){\'use strict\';\nvar ' + varDefs.join(',\n\t') + ';\n\n' +
                source.join('\n') + '\nreturn out;\n})()';
        },
        compileClass: function (metadata, name, vars) {
            var item = metadata[name],
                source,
                _self = this;
            vars[item.type] = '_known[\'' + item.type + '\']';

            this._knownVars = [];
            for (var key in item.private) {
                if (item.private.hasOwnProperty(key)) {
                    if (!item.private[key].children)
                        this._knownVars.push(key);
                }
            }

            var out = '';

            if (item.events) {
                out += '\t\tthis._subscribeList = [];\n';
                out += '\t\tthis._subscribeEvents = function(){\n';

                item.events.forEach(function (evt) {
                    out += '\t\t\tthis._subscribeList.push(this.removableOn(\'' + evt.events + '\', function(' + evt.args.join(',') + '){\n' +
                        evt.fn + '\n}, self));\n';
                });
                out += '\t\t};\n';
                out += '\t\tthis._subscribeEvents();\n';
            }

            /*
            for (var i in item.prop) {
                var prop = item.prop[i];
                var pipes = prop.value;
                if (pipes.isPipe) {
                    out += this.makePipe(pipes, 'self.id', i, item);
                } else {
                    var propVal = this.propertyGetter(prop);
                        out += '\t\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }*/

            this.nestingCount = 0;
            var props = [
                {name: 'value', value: 'new Base.Property("Variant")'}
            ];

            var compiledChildren=item.children ? item.children.map(function (el) {
                return _self.compileChild(el, item, props);
            }).join('') : '//no children\n';

            source = [
                'var ' + name + ' = out[\'' + name + '\'] = ' + item.type + '.extend(\'' + name + '\', {_prop: {' +
                    props.map(function(item){return item.name+': '+item.value; }).join(',\n') +
                '}}, function(){',
                '    ' + item.type + '.apply(this, arguments);',
                '    var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;',
                '',
                out,
                this.makePublic(item.public, item),
                this.makePublic(item.private, item),
                compiledChildren,
                '    this._init();',
                '});'
            ];
            return source;
        },
        makePipe: function (pipe, sourceComponent, targetProperty, def) {
            var pipeSources = [];
            var mutatorArgs = [];
            var fn = pipe.fn;

            for (var cName in pipe.vars) {
                if (pipe.vars.hasOwnProperty(cName)) {
                    for (var fullName in pipe.vars[cName]) {
                        if (pipe.vars[cName].hasOwnProperty(fullName)) {

                            var pipeVar = pipe.vars[cName][fullName];
                            var source = '\'' + fullName + '\'';
                            if (cName == 'this') {
                                source = 'this.id + \'.' + pipeVar.property.name + '\'';
                            } else if ((def.public && (cName in def.public)) || (def.private && (cName in def.private)) || cName === 'value') {
                                //source = source = 'self.id + \'.' + fullName + '\'';
                            }

                            pipeSources.push(source);

                            var mArg = fullName.replace(/\./g, '');
                            mutatorArgs.push(mArg);

                            fn = fn.replace(new RegExp(fullName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'g'), mArg);
                        }
                    }
                }
            }
            return '\tmutatingPipe = new Base.Pipes.MutatingPipe(\n' +
                '\t    [' +
                pipeSources.join(',') +
                '],\n' +
                '\t    {component: this.id, property: \'' + targetProperty + '\'}\n' +
                '\t);\n' +
                '\tmutatingPipe.addMutator(function (' + mutatorArgs.join(',') + ') {\n' +
                '\t    return ' + fn + ';\n' +
                '\t});\n' +
                '\teventManager.registerPipe(mutatingPipe);\n';
        },
        makePublic: function (props, def) {
            var i, prop, pipes, out = '', propVal;
            for (i in props) {
                prop = props[i];
                pipes = prop.value;

                if (pipes && pipes.isPipe) {
                    out += this.makePipe(pipes, 'this.id', i, def);
                } else {
                    propVal = this.propertyGetter(prop)
                    out += '\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }
            return out;
        },
        compileChild: function (child, parent, props) {
            var type = child.type,
                _self = this;

            if (!cmetadata[type])
                if (!QObject._knownComponents[type] || !(QObject._knownComponents[type].prototype instanceof QObject._knownComponents.AbstractComponent))
                    return '';

            var compiledChildren = '';
            if (child.children) {
                this.nestingCount += 1;
                compiledChildren = child.children.map(function(item){
                    return _self.compileChild(item, child, props);
                }).join('');
                this.nestingCount -= 1;
            }

            var out = '';
            var initSet='';

            if (this.nestingCount > 0) {
                out = '\t' + (child.name ? 'var '+child.name+' = ' : 'tmp = ') + '(function(parent){\n' +
                    '\t\teventManager.registerComponent(this);\n' + compiledChildren;

            } else {
                out = '\t' + (child.name ? 'var '+child.name+' = ' : 'tmp = ') + ' (function(){\n' +
                    '\t\teventManager.registerComponent(this);\n' + compiledChildren;
            }
            var i, prop, propVal, pipes;

            if (child.value)
                if (child.value.isPipe) {
                    var pipe = child.value;
                    out += this.makePipe(pipe, 'self.id', 'value', parent);
                } else {
                    propVal = this.propertyGetter(child);
                    initSet += '\t\t'+(child.name?child.name:'tmp')+'.set(\'value\', ' + propVal + ');\n';
                }

            if( child.name){
                props.push({name: child.name, value: 'new Base.Property(\''+ child.type +'\')'})
            }

            for (i in child.prop) {

                prop = child.prop[i];
                pipes = prop.value;
                if (pipes.isPipe) {
                    out += this.makePipe(pipes, 'self.id', i, parent);
                } else {
                    propVal = this.propertyGetter(prop);
                    initSet += '\t\t'+(child.name?child.name:'tmp')+'.set(\'' + i + '\', ' + propVal + ');\n';
                }
            }
            if (child.events) {
                out += '\t\tthis._subscribeList = [];\n';
                out += '\t\tthis._subscribe = function(){\n';

                child.events.forEach(function (evt) {
                    out += '\t\t\tthis._subscribeList.push(this.removableOn(\'' + evt.events + '\', function(' + evt.args.join(',') + '){\n' +
                        evt.fn + '\n}, self));\n';
                });
                out += '\t\t};\n';
                out += '\t\tthis._subscribe();\n';
            }
            if (this.nestingCount > 0) {
                out += '\t\tparent.addChild(this);\n\n';
                out += '\t\treturn this;\n' +
                    '\t}).call( new _known[\'' + child.type/*TODO: escape*/ + '\']({' +
                    (child.name ? 'id: \'' + child.name + '\'' : '') + '}), this );\n';
            } else {
                out += '\t\tparent._ownComponents.push(this);\n\n';
                out += '\t\treturn this;\n' +
                    '\t}).call( new _known[\'' + child.type/*TODO: escape*/ + '\']({' +
                    (child.name ? 'id: \'' + child.name + '\'' : '') + '}) );\n';
            }
            out+=initSet;
            if(child.name){
                out+='self.set(\''+child.name+'\', '+child.name+');';
            }

            return out;
        },
        propertyGetter: function (prop) {
            if (Array.isArray(prop.value))
                return prop.value[0].data;

            if (prop.type==='Number')
                return prop.value;

            //console.log(prop.type);

            if (prop.type==='Boolean')
                return prop.value;


            return '\'' + prop.value + '\'';
        }
    });
})();