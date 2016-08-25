/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * *
 */
;// QUOKKA 2016
// By zibx on 25.08.16.

module.exports = (function () {
    'use strict';
    var namesCount = {};
    var VariableExtractor = require('./VariableExtractor'),
        ASTtransformer = require('./ASTtransformer');

    function getTmpName(type) {
        if (!namesCount.type)
            namesCount.type = 0;
        namesCount.type += 1;
        return type.charAt(0).toLowerCase() + type.slice(1) + namesCount.type;
    }
    var tools = {
        getTmpName: getTmpName,
        getPropertyType: function(propList, prop){
            var type = propList._prop && 
                propList._prop[prop] && 
                propList._prop[prop].prototype;
            return type ? type.type : false;
        },
        dataExtractor: function (prop) {
            var type = prop.type;
            var val = prop.value,
                out;
            if (typeof val === 'string') {
                out = val;
            } else {
                out = val.map(extractor).join('');
            }

            if (type === 'Variant' || type === 'String')
                return JSON.stringify(out);
            else if(type === 'Array' || type === 'Number' || type === 'Boolean')
                return out;
            console.warn('Unknown type: '+type);
            return new Error('Unknown type: '+type);
        },
        propertyGetter: function (prop, vars) {

            if (prop.type==='Variant')
                return JSON.stringify(prop.value);

            if(prop.type === 'ItemTemplate')
                return this.compileClass(prop, scope, true).join('\n');

            var val = this.dataExtractor(prop);

            return val;
        },
        makeProp: function (name, val) {
            return '\'' + name + '\': ' + val;
        },
        _functionTransform: function(fn, definedVars){
            var vars = VariableExtractor.parse(fn),
                counter = 1,
                _self = this, i,
                undefinedVars = vars.getFullUnDefined();

            definedVars = definedVars || {};

            for( i in definedVars )
                undefinedVars[i] = null;

            fn = new ASTtransformer().transform(vars.getAST(), undefinedVars, {
                escodegen: {format: {compact: true}},
                variableTransformer: function(node, stack){
                    var crafted = ASTtransformer.craft.js(node)
                    console.log('! ', crafted, node.type)
                    if(node.type === 'MemberExpression') {
                        var subDefinedVars = Object.create(definedVars);
                        subDefinedVars[stack[stack.length - 1].name] = true;
                        var sub = _self._functionTransform(ASTtransformer.craft.js(node), subDefinedVars);
                        console.log('^^ '+sub)
                    }
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
            //fn = this._functionTransform(fn);

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
            return 'eventManager.registerPipe(new Base.Pipes.MutatingPipe([\n' +
                '\t\t' +
                pipeSources.join(',') +
                '\n\t], {\n' +
                '\t\tcomponent: ' + childId + ', property: \'' + targetProperty + '\'\n' +
                '\t}).addMutator(function (' + mutatorArgs.join(',') + ') {\n' +
                '\t\treturn ' + fn + '\n' +
                '\t}));';
        },
        compilePipe: {
            raw: function(val){
                return val.map(function (item) {
                    if (item.type === 'quote')
                        return item.data;
                    return item.pureData;
                }).join('');
            },
            string: function(val){
                return val.map(function (item) {
                    if (item.type === 'text' || item.type === 'quote')
                        return '\'' + item.pureData + '\'';// TODO: escape
                    else
                        return '(' + item.pureData + ')';
                }).join('+');
            }
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
        },
        indent: function(number, data){
            if(!number)
                return data;

            var indent = (new Array(number+1)).join('\t');
            if(Array.isArray(data))
                return data.map(function(line){
                    return indent+line;
                });
            else
                return this.indent(number, data.split('\n')).join('\n');
        }
    };
    return tools;
})();