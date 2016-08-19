/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function () {
    'use strict';
    var QObject = require('../../Base/QObject'),
        cmetadata = {};
    var uuid = require('tiny-uuid'),
        tools = require('./tools');
    var notComment = function( el ){return el.type !== 'comment'; },
        getData = function( el ){return el.data; },
        getPureData = function( el ){return el.pureData; };
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

            if(name === void 0) {
                inline = true;
                item = metadata;
                name = item.type+uuid();
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

            var compiledChildren=item.children ? item.children.map(function (el) {
                return _self.compileChild(el, item, props, vars, 0);
            }).join('') : '//no children\n';

            source = [
                (inline?'':'var ' + name + ' = out[\'' + name + '\'] = ' )+ item.type + '.extend(\'' + name + '\', {_prop: {' +
                    props.map(function(item){return item.name+': '+item.value; }).join(',\n') +
                '}}, function(){',
                '    ' + item.type + '.apply(this, arguments);',
                '    var tmp, eventManager = this._eventManager, mutatingPipe, parent=this, self=this;',
                item.events?this.builder.events(item):'',
                '',
                out,
                this.makePublic(item.public, item, vars),
                this.makePublic(item.private, item, vars),
                compiledChildren,
                '    this._init();',
                '})'+(inline?'':';')
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
        makePublic: function (props, def, vars) {
            var i, prop, pipes, out = '', propVal;
            for (i in props) {
                prop = props[i];
                pipes = prop.value;

                if (pipes && pipes.isPipe) {
                    out += this.makePipe(pipes, 'this.id', i, def);
                } else {

                    propVal = this.propertyGetter(prop, vars)
                    console.log(i,propVal, JSON.stringify(prop))
                    out += '\tthis.set(\'' + i + '\', ' + propVal + ')\n';
                }
            }
            return out;
        },
        compileChild: function (child, parent, props, vars, nestingCount) {
            var type = child.type,
                _self = this, propList;

            if (!(propList = cmetadata[type]))
                if (!QObject._knownComponents[type] || !((propList = QObject._knownComponents[type].prototype) instanceof QObject._knownComponents.AbstractComponent))
                    return '';

            var compiledChildren = '';
            if (child.children) {

                compiledChildren = child.children.map(function(item){
                    return _self.compileChild(item, child, props, vars, nestingCount + 1);
                }).join('');

            }

            var out = '';
            var initSet='';

            if (nestingCount > 0) {
                out = '\t' + (child.name ? 'var '+child.name+' = ' : 'tmp = ') + '(function(parent){\n' +
                    '\t\teventManager.registerComponent(this);\n' + compiledChildren;

            } else {
                out = '\t' + (child.name ? 'var '+child.name+' = ' : 'tmp = ') + ' (function(){\n' +
                    '\t\teventManager.registerComponent(this);\n' + compiledChildren;
            }
            var i, prop, propVal, pipes;

            if (child.value)
                (child.prop || (child.prop = {})).value = {
                    name: 'value',
                    type: propList._prop && propList._prop.value && propList._prop.value.prototype ? propList._prop.value.prototype.type: 'Variant',
                    value: child.value};

            if( child.name){
                props.push({name: child.name, value: 'new Base.Property(\''+ child.type +'\')'});
            }

            for (i in child.prop) {

                prop = child.prop[i];
                pipes = prop.value;
                if (pipes.isPipe) {
                    out += this.makePipe(pipes, 'self.id', i, parent);
                } else {
                    propVal = this.propertyGetter(prop, vars);
                    console.log('~',i,propVal)
                    initSet += '\t\t'+(child.name?child.name:'tmp')+'.set(\'' + i + '\', ' + propVal + ');\n';
                }
            }

            if (child.events)
                out += this.builder.events(child);

            if (nestingCount > 0) {
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
            events: function(item){
                var out = '';
                out += '\t\tthis._subscribeList = [];\n';
                out += '\t\tthis._subscr = function(){\n';

                item.events.forEach(function (evt) {
                    out += '\t\t\tthis._subscribeList.push(this.removableOn(\'' + evt.events + '\', function(' + evt.args.join(',') + '){\n' +
                        evt.fn + '\n}, this));\n';
                });
                out += '\t\t};\n';
                out += '\t\tthis._subscr();\n';
                return out;
            }
        }
    });
})();