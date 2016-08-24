/**
 * Created by zibx on 08.07.16.
 */

var namesCount = {};

function getTmpName(type) {
    if (!namesCount.type)
        namesCount.type = 0;
    namesCount.type += 1;
    return type.charAt(0).toLowerCase() + type.slice(1) + namesCount.type;
}

module.exports = (function () {
    'use strict';
    var QObject = require('../../Base/QObject'),
        cmetadata = {};
    var uuid = require('tiny-uuid'),
        tools = require('./tools');
    var notComment = function( el ){return el.type !== 'comment'; },
        getData = function( el ){return el.data; },
        getPureData = function( el ){return el.pureData; },
        VariableExtractor = require('./VariableExtractor'),
        ASTtransformer = require('./ASTtransformer');
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
                _self = this,
                inline = false;

            if (name === void 0) {
                inline = true;
                item = metadata;
                name = item.type + uuid();
            }

            vars[item.type] = '_known[\'' + item.type + '\']';

            this._knownVars = [];
            for (var key in item.private) {
                if (item.private.hasOwnProperty(key)) {
                    if (!item.private[key].children)
                        this._knownVars.push(key);
                }
            }

            var out = '';


            var props = [
                {name: 'value', value: 'new Base.Property("Variant")'}
            ];

            var compiledChildren = item.children ? item.children.map(function (el) {
                return _self.compileChild(el, item, props, vars, 0);
            }).join('') : '//no children\n';
            //debugger;
            source = [
                (inline ? '' : 'var ' + name + ' = out[\'' + name + '\'] = ' ) + item.type + '.extend(\'' + name + '\', {_prop: {' +
                props.map(function (item) {
                    return item.name + ': ' + item.value;
                }).join(',\n') +
                '}}, function(){',
                '    ' + item.type + '.apply(this, arguments);',
                '    var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;',
                item.events ? this.builder.events(item) : '',
                '',
                out,
                this.makePublic(item.public, item, vars),
                this.makePublic(item.private, item, vars),
                compiledChildren,
                '    this._init();',
                '})' + (inline ? '' : ';')
            ];
            return source;
        },

        _functionTransform: function(fn){
            var vars = VariableExtractor.parse(fn),
                o = vars.getFullUnDefined(),
                counter = 1,
                _self = this;

            fn = new ASTtransformer().transform(vars.getAST(), o, {
                escodegen: {format: {compact: true}},
                variableTransformer: function(node){
                    var crafted = ASTtransformer.craft.js(node)
                    console.log('! ', crafted, node.type)
                    if(node.type === 'MemberExpression')
                        _self._functionTransform(ASTtransformer.craft.js(node))
                    return ASTtransformer.craft.Identifier('var'+(counter++));
                }
            });
            return fn;
        },

        makePipe: function (pipe, sourceComponent, targetProperty, def, childId, prop) {

            var pipeSources = [];
            var mutatorArgs = [];
            var fn = pipe.fn;
            
            if(prop.type === 'Number' || prop.type === 'Array')
                fn = tools.compilePipe.raw(fn);
            else
                fn = tools.compilePipe.string(fn);
            
            /** do magic */
            fn = this._functionTransform(fn);
            
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

                            fn = fn.replace(new RegExp(fullName/*.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")*/, 'g'), mArg);
                        }
                    }
                }
            }
            return '\teventManager.registerPipe(new Base.Pipes.MutatingPipe([\n' +
                '\t\t' +
                pipeSources.join(',') +
                '\n\t\t], {\n' +
                '\t\t\tcomponent: ' + childId + ', property: \'' + targetProperty + '\'\n' +
                '\t\t}).addMutator(function (' + mutatorArgs.join(',') + ') {\n' +
                '\t\t\treturn ' + fn + '\n' +
                '\t\t}));';
        },
        makePublic: function (props, def, vars) {
            var i, prop, pipes, out = '', propVal;
            for (i in props) {
                prop = props[i];
                pipes = prop.value;

                if (pipes && pipes.isPipe) {
                    out += this.makePipe(pipes, 'this.id', i, def, 'this.id', prop);
                } else {

                    propVal = this.propertyGetter(prop, vars);

                    //console.log(i,propVal, JSON.stringify(prop));
                    if(!(propVal instanceof Error))
                        out += '\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }
            return out;
        },
        makeProp: function (name, val) {
            return '\'' + name + '\': ' + val;
        },
        compileChild: function (child, parent, props, vars, nestingCount) {
            var type = child.type,
                _self = this,
                propList,
                out = '',
                cfgInit = [],
                pipes = [],
                compiledChildren = [],
                events = [];

            if (!child.name) {
                child.tmpName = getTmpName(child.type)
            }

            if (!(propList = cmetadata[type]))
                if (!QObject._knownComponents[type] || !((propList = QObject._knownComponents[type].prototype) instanceof QObject._knownComponents.AbstractComponent))
                    return '';

            if (child.children) {
                compiledChildren = child.children.map(function (item) {
                    return _self.compileChild(item, child, props, vars, nestingCount + 1);
                });
            }

            var i, prop, propVal, pipe;

            if (child.value)
                (child.prop || (child.prop = {})).value = {
                    name: 'value',
                    type: propList._prop && propList._prop.value && propList._prop.value.prototype ? propList._prop.value.prototype.type : 'Variant',
                    value: child.value
                };

            if (child.cls)
                (child.prop || (child.prop = {})).cls = {
                    name: 'cls',
                    type: propList._prop && propList._prop.value && propList._prop.cls.prototype ? propList._prop.cls.prototype.type : 'Variant',
                    value: child.cls
                };

            if (child.name) {
                props.push({name: child.name, value: 'new Base.Property(\'' + child.type + '\')'});
            }

            for (i in child.prop) {

                prop = child.prop[i];
                pipe = prop.value;
                if (pipe.isPipe) {
                    pipes.push(this.makePipe(pipe, 'self.id', i, parent, (child.name || child.tmpName) + '.id', prop));
                } else {
                    propVal = this.propertyGetter(prop, vars);
                    //console.log('~',i,propVal)
                    cfgInit.push(this.makeProp(i, propVal));
                }
            }

            if (child.name)
                cfgInit.push('id: \'' + child.name + '\'');

            if (child.events)
                events = this.builder.events(child);

            var addToParent = '';
            if (nestingCount > 0) {
                addToParent = (parent.name || parent.tmpName) + '.addChild(' + (child.name || child.tmpName) + ');\n';
                addToParent += 'eventManager.registerComponent(' + (child.name || child.tmpName) + ');\n';
            } else {
                addToParent = 'this._ownComponents.push(' + (child.name || child.tmpName) + ');\n';
            }
            addToParent += (child.name || child.tmpName)+'.mainEventManager=eventManager;\n';

            out += '// ' + (child.name || child.tmpName);
            out += '\nvar ' + (child.name || child.tmpName) + ' = new _known[\'' + child.type + '\']({\n' +
                cfgInit.join(',\n') + '\n});\n';

            out += addToParent;

            out += '\n// children of ' + (child.name || child.tmpName) + '\n';
            out += compiledChildren.join(';\n');

            out += '\n// pipes of ' + (child.name || child.tmpName) + '\n';
            out += pipes.join('\n');

            out += '\n// events of ' + (child.name || child.tmpName) + '\n';
            out += events.join('\n');

            out += '\n\n';

            if (child.name) {
                out += 'this.set(\'' + child.name + '\', ' + child.name + ')';
            }

            return out;
        },

        propertyGetter: function (prop, vars) {

            if (prop.type==='Variant')
                return JSON.stringify(prop.value);

            if(prop.type === 'ItemTemplate')
                return this.compileClass(prop, void 0, vars).join('\n');

            var val = tools.dataExtractor(prop);

            return val;
            /*
            if (prop.type==='Array')
                return prop.value[0].data;

            if (prop.type==='Number')
                return prop.value;

            if (prop.type==='Boolean')
                return prop.value;

            if (prop.type==='String')
                return '\'' + prop.value.filter( notComment ).map( getData ).join( '' ) + '\'';*/


        },

        builder: {
            events: function (item) {
                var name = (item.name || item.tmpName);
                var out = [];
                //out += name+'._subscribeList = [];\n';
                //out += '\t\tthis._subscr = function(){\n';

                //out+=name+'.removableOn(\''+evt.events+'\',function(' + evt.args.join(',') + '){\n' + evt.fn + '\n})';

                item.events.forEach(function (evt) {
                    out.push(name + '.on(\'' + evt.events + '\',function(' + evt.args.join(',') + '){\n' + evt.fn + '\n}, '+name+');');
                    //out += '\t\t\tthis._subscribeList.push(this.removableOn(\'' + evt.events + '\', function(' + evt.args.join(',') + '){\n' + evt.fn + '\n}, this));\n';
                });
                //out += '\t\t};\n';
                //out += '\t\tthis._subscr();\n';
                return out;
            }
        }
    });
})();