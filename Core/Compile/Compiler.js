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
                source;
            vars[item.type] = '_known[\'' + item.type + '\']';

            this._knownVars = [];
            for (var key in item.private) {
                if (item.private.hasOwnProperty(key)) {
                    if (!item.private[key].children)
                        this._knownVars.push(key);
                }
            }

            var out = '';
            for (var i in item.prop) {
                var prop = item.prop[i];
                var pipes = prop.value;
                if (pipes.isPipe) {
                    out += this.makePipe(pipes, 'self.id', i);
                } else {
                    var propVal = this.propertyGetter(prop);
                    out += '\t\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }

            this.nestingCount = 0;

            source = [
                'var ' + name + ' = out[\'' + name + '\'] = ' + item.type + '.extend(\'' + name + '\', {}, function(){',
                '    ' + item.type + '.apply(this, arguments);',
                '    var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;',
                '',
                this.makePublic(item.public),
                item.children ? item.children.map(this.compileChild.bind(this)).join('') : '//no children\n',
                '    this._init();',
                '});'
            ];
            return source;
        },
        makePipe: function (pipe, sourceComponent, targetProperty) {
            var pipeSources = [];
            var mutatorArgs = [];
            var fn = pipe.fn;

            for (var cName in pipe.vars) {
                if (pipe.vars.hasOwnProperty(cName)) {
                    for (var fullName in pipe.vars[cName]) {
                        if (pipe.vars[cName].hasOwnProperty(fullName)) {
                            var source = '';

                            var mArg = fullName.replace(/\./g, '');
                            mutatorArgs.push(mArg);
                            fn = fn.replace(new RegExp(fullName, 'g'), mArg);

                            if (fullName.indexOf('.') === -1) {
                                source = 'self.id + \'.' + fullName + '\'';
                            } else {
                                source = '\'' + fullName + '\'';
                            }

                            pipeSources.push(source);
                        }
                    }
                }
            }

            /*for (var cName in pipe.vars) {
                if (pipe.vars.hasOwnProperty(cName)) {
                    for (var fullName in pipe.vars[cName]) {
                        if (pipe.vars[cName].hasOwnProperty(fullName)) {

                            var pipeVar = pipe.vars[cName][fullName];
                            var source = '\'' + fullName + '\'';

                            if (this._knownVars.indexOf(cName) !== -1) {
                                source = source = 'self.id + \'.' + fullName + '\'';
                            }
                            if (cName == 'this') {
                                source = 'this.id + \'.' + pipeVar.property.name + '\'';
                            }
                            pipeSources.push(source);

                            var mArg = fullName.replace(/\./g, '');
                            mutatorArgs.push(mArg);

                            console.log(fn);
                            fn = fn.replace(new RegExp(fullName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")), mArg);
                            console.log(fn);
                        }
                    }
                }
            }*/

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
        makePublic: function (props) {
            var i, prop, pipes, out = '', propVal;
            for (i in props) {
                prop = props[i];
                pipes = prop.value;

                if (pipes && pipes.isPipe) {
                    out += this.makePipe(pipes, 'this.id', i);
                } else {
                    propVal = this.propertyGetter(prop);
                    out += '\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }
            return out;
        },
        compileChild: function (child) {
            var type = child.type;

            if (!cmetadata[type])
                if (!QObject._knownComponents[type] || !(QObject._knownComponents[type].prototype instanceof QObject._knownComponents.AbstractComponent))
                    return '';

            var compiledChildren = '';
            if (child.children) {
                this.nestingCount += 1;
                compiledChildren = child.children.map(this.compileChild.bind(this)).join('');
                this.nestingCount -= 1;
            }

            var out = '';
            if (this.nestingCount > 0) {
                out = '\ttmp = (function(parent){\n' +
                    '\t\teventManager.registerComponent(this);\n' + compiledChildren;

            } else {
                out = '\ttmp = (function(){\n' +
                    '\t\teventManager.registerComponent(this);\n' + compiledChildren;
            }
            var i, prop, propVal, pipes;

            if (child.value)
                if (child.value.isPipe) {
                    var pipe = child.value;
                    out += this.makePipe(pipe, 'self.id', 'value');
                } else {
                    propVal = this.propertyGetter(child);
                    out += '\t\tthis.set(\'value\', ' + propVal + ')\n';
                }

            for (i in child.prop) {
                prop = child.prop[i];
                pipes = prop.value;
                if (pipes.isPipe) {
                    out += this.makePipe(pipes, 'self.id', i);
                } else {
                    propVal = this.propertyGetter(prop);
                    out += '\t\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }
            if (child.events) {
                out += '\t\tthis._subscribeList = [];\n';
                out += '\t\tthis._subscribe = function(){\n';

               /* for (var i = 0; i < this._knownVars.length; i++) {
                    var kv = this._knownVars[i];
                    evt.fn.replace(new RegExp(kv, g), 'eventManager._registredComponents['+this._knownVars+']');
                }*/

                child.events.forEach(function (evt) {
                    out += '\t\t\tthis._subscribeList.push(this.removableOn(\'' + evt.events + '\', function(' + evt.args.join(',') + '){\n' +
                        evt.fn + '\n}, this));\n';
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

            return out;
        },
        propertyGetter: function (prop) {
            if (Array.isArray(prop.value))
                return prop.value[0].data;
            return '\'' + prop.value + '\'';
        }
    });
})();