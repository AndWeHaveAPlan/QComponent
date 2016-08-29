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

    var extractors = {
            quote: function (token) {
                return token.pureData;
            },
            brace: function(token){
                return token.pureData;
            }
        },
        extractor = function(token){
            var extractor = extractors[token.type];
            if(!extractor){
                throw new Error('unknown token type `'+token.type+'`')
            }
            return extractor(token);
        };

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
                undefinedVars = vars.getFullUnDefined(),

                intermediateVars = {},
                wereTransforms = false;

            definedVars = definedVars || {};

            for( i in definedVars )
                undefinedVars[i] = null;

            fn = new ASTtransformer().transform(vars.getAST(), undefinedVars, {
                escodegen: {format: {compact: true}},
                variableTransformer: function(node, stack){
                    wereTransforms = true;

                    var crafted = ASTtransformer.craft.js(node),
                        sub, id = 'var'+(counter++);

                    //console.log('! ', crafted, node.type)
                    if(node.type === 'MemberExpression') {
                        var subDefinedVars = Object.create(definedVars),
                            deepestVar = stack[stack.length - 1].name;
                        subDefinedVars[deepestVar] = true;


                        //console.log('^^$ ')
                        sub = _self._functionTransform(ASTtransformer.craft.js(node), subDefinedVars, true);
                        //console.log('^^ '+sub)
                        intermediateVars[id] = sub;
                        typeof sub !== 'string' && (sub[deepestVar] = deepestVar);
                    }else{
                        intermediateVars[id] = ASTtransformer.craft.js(node);
                    }

                    return ASTtransformer.craft.Identifier(id);
                }
            });
            intermediateVars[' fn '] = fn;
            //console.log(intermediateVars);
            return intermediateVars;//wereTransforms?intermediateVars:fn;
        },

        functionWaterfall: function(x, pipe, item, scope,cls, prop, place){
            var metadata = cls.metadata,
                valueAdded;
            var itemTransform = function (item) {
                console.log(item)

                if(metadata.private[item] || metadata.public[item])
                    item = 'self.'+item;

                if(item.indexOf('.')===-1){
                    /** take default property. now it is `value`, TODO: get it from metadata */
                    item = item+'.value';
                    valueAdded = true;
                }
                
                /** mega cheat */
                return item.split('.').map(function(el){ return '\''+el+'\''});
            };
            var transform = function(cfg, name, indent){
                indent = indent |0;
                var list = [], fn, list2 = [];
                for(var i in cfg){
                    if( i !== ' fn '){
                        list.push(i);
                        list2.push(cfg[i])
                    }
                }

                /*if(list2.length === 1 && indent > 0) {
                    console.log(list2)
                    return '[' + itemTransform(list[0]) + ']';
                }*/

                fn =
                    'eventManager.p(\n'+
                    '\t['+ list2.map(function(item, i){
                        if(typeof item === 'string')
                            return '['+itemTransform(item)+']';
                        else
                            return ''+transform(item, list[i], indent + 1)
                    }).join(', ') +'], '+
                    /*
                     '\tfunction(done){\n'+
                     '\tvar lastValue, firstCall = true;\n'+
                     '\treturn '*/
                    'function('+ list.join(', ') +'){\n'+
                    '\t\t\treturn '+cfg[' fn '] + '\n'/*+
                     '\t\tif(firstCall || lastValue !== out){\n'+
                     '\t\t\tdone('+(name?'\''+name+'\', ':'')+'out, lastValue);\n'+
                     '\t\t\tlastValue = out; firstCall = false;\n'+

                     '\t\t}\n'+
                     '\t};\n'*/+
                    '\t\t})';

                //console.log(fn)

                return tools.indent(indent, fn).trim();
            };
            return transform(x)

        },

        makePipe: function (pipe, item, scope, cls, prop, place){//sourceComponent, targetProperty, def, childId, prop) {

            var pipeSources = [];
            var mutatorArgs = [];
            var fn = pipe.fn;

            if(prop.type === 'Number' || prop.type === 'Array')
                fn = tools.compilePipe.raw(fn);
            else
                fn = tools.compilePipe.string(fn);

            /** do magic */
            fn = this._functionTransform(fn);
            //console.log(this.functionWaterfall(fn))

            /*for (var cName in pipe.vars) {
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

                            fn = fn.replace(new RegExp(fullName/!*.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")*!/, 'g'), mArg);
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
                '\t}));';*/


            return (this.functionWaterfall(fn, pipe, item, scope,cls, prop, place)+
                '.after(function(val){eventManager.s([\''+
                (item.name||item.tmpName)+'\',\''+ prop.name +'\'], val)});');
        },

        functionNet: function () {
            var getValue = function(s){
                if(typeof s === 'string'){
                    return s
                }else{
                    var fn = s[' fn '], i, m = 0, vars = [], varNames = [], varsHash = {};
                    for(i in s)
                        if(i!== ' fn '){
                            vars[m] = getValue(s[i]);
                            varNames[m] = i;
                            varsHash[i] = m++;
                        }
                    //console.log(vars, varNames)
                    //console.log(new Function(varNames.join(','),'return '+fn).toString())
                    return vars
                }


            }
            getValue(s)
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