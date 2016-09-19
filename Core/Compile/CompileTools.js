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
    var QObject = require('../../Base/QObject'),
        AbstractComponent = require('../../Base/Components/AbstractComponent'),
        VariableExtractor = require('./VariableExtractor'),
        ASTtransformer = require('./ASTtransformer'),
        shadow = require('./../Shadow');
    var primitives = {
        'Number': true, 'String': true, 'Array': true, 'Boolean': true, 'Function': true
    };
    var extractors = {
        quote: function (token) {
            return token.pureData;
        },
        brace: function (token) {
            return token.pureData;
        },
        text: function (token) {
            return token.pureData;
        }
    },
        typedExtractors = {
            'Function': function (token, type, cls) {
                var t = shadow.QObject.eventParser(type.item, type.item.children);
                return tools.functionTransform(t, cls.metadata);
            }
        },
        extractor = function (token, prop, cls) {
            var extractor;
            extractor = typedExtractors[prop.type];
            if (!extractor) {
                extractor = extractors[token.type];
                if (!extractor) {
                    throw new Error('unknown token type `' + token.type + '`')
                }
            }
            return extractor(token, prop, cls);
        };

    function getTmpName(type) {
        if (!namesCount.type)
            namesCount.type = 0;
        namesCount.type += 1;
        return type.charAt(0).toLowerCase() + type.slice(1) + namesCount.type;
    }
    var tools = {
        getTmpName: getTmpName,
        getPropertyType: function (propList, prop) {
            var type = propList._prop &&
                propList._prop[prop] &&
                propList._prop[prop].prototype;
            return type ? type.type : false;
        },
        dataExtractor: function (prop, cls) {
            var type = prop.type;
            var val = prop.value,
                out;
            if (typeof val === 'string') {
                out = extractor({ type: 'text', pureData: val }, prop, cls);
            } else {
                if(type === 'Function')
                    out =  extractor(val[0], prop, cls);
                else
                    out = val.map(function (item) {
                        return extractor(item, prop, cls);
                    }).join(''); // TODO pizda
            }

            if (type === 'Variant' || type === 'String')
                return JSON.stringify(out);
            else if (type === 'Array' || type === 'Number' || type === 'Boolean' || type === 'Function')
                return out;
            console.warn('Unknown type: ' + type);
            return new Error('Unknown type: ' + type);
        },
        /**
         * *
         * @param {} prop 
         * @param {} scope 
         * @returns {} 
         */
        propertyGetter: function (prop, scope, vars, cls) {

            function checkType(sourceType, targetType) {
                var type = (scope.metadata[sourceType] && scope.metadata[sourceType].type) || (QObject._knownComponents[sourceType] && QObject._knownComponents[sourceType]._type);
                if (type && targetType === type) {
                    return true;
                } else if (type !== 'QObject' && type !== void (0)) {
                    return checkType(type, targetType);
                } else {
                    return false;
                }
            }

            if (prop.type === 'Variant')
                return JSON.stringify(prop.value);

            var known = QObject._knownComponents[prop.type];

            if (known && known.prototype instanceof QObject) {
                if (prop.value && checkType(prop.value, prop.type)) {
                    return 'QObject._knownComponents[\'' + prop.value + '\']';
                } else {
                    return scope.cls(prop).compile(true).join('\n');
                }
            }

            var val = this.dataExtractor(prop, cls);

            return val;
        },
        makeProp: function (name, val) {
            return '\'' + name + '\': ' + val;
        },
        _functionTransform: function (fn, definedVars) {
            var vars = VariableExtractor.parse(fn),
                counter = 1,
                _self = this, i,
                undefinedVars = vars.getFullUnDefined(),

                intermediateVars = {},
                wereTransforms = false;

            definedVars = definedVars || {};

            for (i in definedVars)
                undefinedVars[i] = null;

            fn = new ASTtransformer().transform(vars.getAST(), undefinedVars, {
                escodegen: { format: { compact: true } },
                variableTransformer: function (node, stack) {
                    wereTransforms = true;

                    var crafted = ASTtransformer.craft.js(node),
                        sub, id = 'var' + (counter++);

                    //console.log('! ', crafted, node.type)
                    if (node.type === 'MemberExpression') {
                        var subDefinedVars = Object.create(definedVars),
                            deepestVar = stack[stack.length - 1].name;
                        subDefinedVars[deepestVar] = true;


                        //console.log('^^$ ')
                        sub = _self._functionTransform(ASTtransformer.craft.js(node), subDefinedVars, true);
                        //console.log('^^ '+sub)
                        intermediateVars[id] = sub;
                        typeof sub !== 'string' && (sub[deepestVar] = deepestVar);
                    } else {
                        intermediateVars[id] = ASTtransformer.craft.js(node);
                    }

                    return ASTtransformer.craft.Identifier(id);
                }
            });
            intermediateVars[' fn '] = fn;
            //console.log(intermediateVars);
            return intermediateVars;//wereTransforms?intermediateVars:fn;
        },

        functionWaterfall: function (x, pipe, item, scope, cls, prop, place) {
            var metadata = cls.metadata,
                valueAdded,
                primitives = {
                    'Number': true, 'String': true, 'Array': true, 'Boolean': true
                };
            var itemTransform = function (item) {
                //console.log(item)
                var wtf = metadata.private[item] || metadata.public[item];
                if (item === 'col1') debugger;
                if (wtf && wtf.type in primitives)
                    item = 'self.' + item;

                if (item.indexOf('.') === -1) {
                    /** take default property. now it is `value`, TODO: get it from metadata */
                    item = item + '.value';
                    valueAdded = true;
                }

                /** mega cheat */
                return item.split('.');
            };
            var transform = function (cfg, name, indent) {
                indent = indent | 0;
                var list = [], fn, list2 = [], _fn = cfg[' fn '],
                    i, _i, item;
                for (i in cfg) {
                    if (i !== ' fn ') {
                        list.push(i);
                        list2.push(cfg[i]);
                    }
                }

                var args = [], transformed;
                for (i = 0, _i = list2.length; i < _i; i++) {
                    item = list2[i];
                    if (typeof item === 'string') {
                        transformed = itemTransform(item);
                        args[i] = '[' + transformed.map(function (el) { return '\'' + el + '\''; }) + ']';

                        var mArg = transformed.join('.');
                        console.log(transformed, item, mArg, list[i]);
                        _fn = _fn.replace(new RegExp(mArg, 'g'), list[i]);

                    } else
                        args[i] = '' + transform(item, list[i], indent + 1);
                }
                /*if(list2.length === 1 && indent > 0) {
                    console.log(list2)
                    return '[' + itemTransform(list[0]) + ']';
                }*/

                fn =
                    'eventManager.p(\n' +
                    '\t[' + args.join(', ') + '], ' +
                    /*
                     '\tfunction(done){\n'+
                     '\tvar lastValue, firstCall = true;\n'+
                     '\treturn '*/
                    'function(' + list.join(', ') + '){\n' +
                    '\t\t\treturn ' + _fn + '\n'/*+
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
        isNameOfEnv: function (name, meta) {
            if (!meta.children)
                return false;
            if (meta.children.length === 0)
                return false;

            var i, _i, children = meta.children, child, subResult;
            for (i = 0, _i = children.length; i < _i; i++) {
                child = children[i];
                if (child.name === name)
                    return child;
                subResult = this.isNameOfEnv(name, child);
                if (subResult)
                    return subResult;
            }
            return false;

        },

        isNameOfProp: function (name, metadata) {
            var prop, tmp;
            if (!metadata || !metadata._prop) {
                if(metadata.public){ // it is shadow
                    if(metadata.public[name])
                        return metadata.public[name];
                    else
                        return false;
                }else
                    throw new Error('Corrupted metadata for `' + name + '`');
            }
            prop = metadata._prop;

            if (prop[name])
                return prop[name];
            if (prop['default'])
                return prop['default'];
            if (prop['_unknownProperty']) {
                tmp = prop['_unknownProperty'](name);
                if(tmp)
                    return tmp;
            }
            return false;
        },

        makePipe: function (pipe, item, scope, cls, prop, place, def) {//sourceComponent, targetProperty, def, childId, prop) {

            var pipeSources = [];
            var mutatorArgs = [],
                targetProperty;
            var fn = pipe.fn,
                childId = item.name || item.tmpName;


            targetProperty = place === 'child' ? prop.name : 'this.id';
            if (place !== 'child') {
                childId = 'self';
                targetProperty = prop.name;
            }

            if (prop.type === 'Number' || prop.type === 'Array')
                fn = tools.compilePipe.raw(fn);
            else
                fn = tools.compilePipe.string(fn);

            /** do magic */
            /*fn = this._functionTransform(fn);
            fn = {"var1":"cf.cardData.name"," fn ":"JSON.stringify(var1);"};*/
            //console.log(this.functionWaterfall(fn))
            var env, cache = {};
            for (var cName in pipe.vars) {
                for (var fullName in pipe.vars[cName]) {

                    var pipeVars = pipe.vars[cName][fullName];
                    for(var i = 0, _i = pipeVars.length; i<_i;i++) {
                        var pipeVar = pipeVars[i];
                        //var source;// = '\'' + fullName + '\'';
                        var source = tools.getVarAccessor(pipeVar, cls, scope);
                        if(!cache[source]) {
                            cache[source] = true;
                            pipeSources.push(source);

                            var mArg = fullName.replace(/\./g, '');
                            mutatorArgs.push(mArg);

                            fn = fn.replace(new RegExp(fullName/*.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")*/, 'g'), mArg);
                        }
                    }
                }
            }

            return 'this.createDependency([\n' +
                '\t\t' +
                pipeSources.map(function (item) {
                    console.log(item);
                    return item;
                }).join(',') +
                '\n\t],' + childId + '.id+\'.' + targetProperty + '\',\n' +
                '\tfunction (' + mutatorArgs.join(',') + ') {\n' +
                '\t\treturn ' + fn + '\n' +
                '\t});';
        },
        getVarInfo: function(stack, metadata, child){
            var i, _i, out = [], node, env, selfFlag = false, context = false,
                envFlag, propFlag, valueFlag = false, thisFlag = false, lastEnv, lastName,

                name;
            for(i = 0, _i = stack.length; i < _i; i++){

                envFlag = propFlag = false;

                node = stack[i];
                if(node.type === 'Literal')
                    name = node.value;
                else
                    name = node.name;

                if(!env || env.type !== 'Variant') {
                    if(node.type === 'ThisExpression'){
                        env = child;
                        thisFlag = true;
                    }else {
                        env = this.isNameOfEnv(name, metadata);
                        if(env)
                            envFlag = true;
                    }

                    if(env && i === 0 && env.type in primitives){ // first token is from `self`
                        selfFlag = true;
                    }

                    if(!env) {
                        env = this.isNameOfProp(name, metadata);

                        if (env)
                            propFlag = true;
                    }

                    if(!env) {
                        if(lastEnv) {
                            console.log(out);
                            throw new Error('Can not resolve `' + name + '` from `' + lastName + '` <' + lastEnv.type + '>');
                        }else
                            throw new Error('Unknown variable `' + name + '`');
                    }
                }
                if(env.type in primitives){
                    metadata = shadow[env.type];
                    if(context === false) {
                        context = i;
                        // we need to keep context
                        if(env.type==='Function')
                            context--;
                    }
                    //if(i < _i - 1)
                    //    throw new Error('Can not get `'+ stack[i+1].name +'` of primitive value `'+node.name+'` <'+env.type+'>')
                }else{
                    metadata = shadow[env.type];
                }
                out.push({name: name, env: envFlag, prop: propFlag, node: node, e: env});
                lastEnv = env;
                lastName = name;
            }
            if(!(env.type in primitives || env.type === 'Variant')){
                valueFlag = true;
            }
            if(out[0].prop)
                selfFlag = true;

            return {
                varParts: out,
                self: selfFlag,
                context: context,
                valueFlag: valueFlag,
                thisFlag: thisFlag
            };
        },
        getVarAccessor: function (tree, cls, scope) {
            var pointer = tree, stack = [],
                metadata = cls.metadata,
                info;
            if(pointer.object) {

                while (pointer.object) {
                    stack.push(pointer.property);
                    pointer = pointer.object;
                }
                stack.push(pointer);
                stack = stack.reverse();
            }else{
                stack.push(pointer);
            }

            info = tools.getVarInfo(stack, metadata);
            if(info.valueFlag)
                info.varParts.push({name: 'value'});
            return (info.self ? 'self.id+\'.' : '\'') + info.varParts.map(function(el){return el.name;}).join('.') +'\'';
            /*console.log(env, out)

            if (cName === 'this') {
                source = 'this.id + \'.' + pipeVar.property.name + '\'';
            } else if ((env = this.isNameOfEnv(cName, cls.metadata)) || (env = this.isNameOfProp(cName, cls.metadata))) {//(def.public && (cName in def.public)) || (def.private && (cName in def.private)) || cName === 'value') {
                if (env.type in primitives) {
                    source = 'self.id + \'.' + fullName + '\'';
                } else {
                    if (fullName.match(/\.value$/))
                        source = '\'' + fullName + '\'';//'[\'' + fullName + '\', \'value\']';
                    else
                        source = '\'' + fullName + '.value\'';//'[\'' + fullName + '\', \'value\']';
                }
            } else {
                source = '\'' + fullName + '\'';
            }
            return source;*/
        },
/*
        functionNet: function () {
            var getValue = function (s) {
                if (typeof s === 'string') {
                    return s
                } else {
                    var fn = s[' fn '], i, m = 0, vars = [], varNames = [], varsHash = {};
                    for (i in s)
                        if (i !== ' fn ') {
                            vars[m] = getValue(s[i]);
                            varNames[m] = i;
                            varsHash[i] = m++;
                        }
                    //console.log(vars, varNames)
                    //console.log(new Function(varNames.join(','),'return '+fn).toString())
                    return vars
                }


            }
            getValue(s);
        },
        */
        compilePipe: {
            raw: function (val) {
                return val.map(function (item) {
                    if (item.type === 'quote')
                        return item.data;
                    return item.pureData;
                }).join('');
            },
            string: function (val) {
                return val.map(function (item) {
                    if (item.type === 'text' || item.type === 'quote')
                        return '\'' + item.pureData + '\'';// TODO: escape
                    else
                        return '(' + item.pureData + ')';
                }).join('+');
            }
        },
        builder: {
            events: function (item, cls, child) {
                var name = (item.name || item.tmpName);
                var out = [], i, _i, events, event;

                //out += name+'._subscribeList = [];\n';
                //out += '\t\tthis._subscr = function(){\n';

                //out+=name+'.removableOn(\''+evt.events+'\',function(' + evt.args.join(',') + '){\n' + evt.fn + '\n})';
                events = item.events;
                for (i = 0, _i = events.length; i < _i; i++) {
                    event = events[i];

                    var fnBody = tools.functionTransform(event, cls.metadata, child);
                    out.push((name||'this') + '.on(\'' + event.events + '\','+fnBody+', ' + (name||'this') + ');');
                }

                //out += '\t\t\tthis._subscribeList.push(this.removableOn(\'' + evt.events + '\', function(' + evt.args.join(',') + '){\n' + evt.fn + '\n}, this));\n';
                //out += '\t\t};\n';
                //out += '\t\tthis._subscr();\n';
                return out;
            }

        },
        functionTransform: function(fnObj, meta, child){
            var transformFnGet = function (node, stack, scope, parent) {
                var list = stack.slice().reverse(),
                    varParts,

                    info = tools.getVarInfo(list, meta, child),
                    firstToken = info.varParts[0],
                    who;

                if (info.self) {
                    who = ASTtransformer.craft.Identifier('self');
                } else {
                    info.context--;
                    info.varParts.shift();

                    who = ASTtransformer.craft.Identifier(firstToken.name);

                }

                var beforeContext = [], afterContext = [], i, _i, item,
                    varItem;
                varParts = info.varParts;

                // need to keep context
                if(info.context === false)
                    info.context = info.varParts.length - 1;

                for(i = 0, _i = varParts.length; i < _i; i++){
                    item = varParts[i];

                    if (item.computed) {
                        varItem = scope.doTransform.call(scope.me, item.node, scope.options);
                    } else {
                        varItem = {
                            'type': 'Literal',
                            'value': item.name,
                            'raw': '\'' + item.name + '\''
                        };
                        if ('_id' in item)
                            varItem._id = item._id;
                    }

                    if( i <= info.context )
                        beforeContext.push(varItem);
                    else
                        afterContext.push(item.node);
                }

                var c = ASTtransformer.craft, // craft short link
                    out;//
                if(beforeContext.length)
                    out = c.CallExpression(who, 'get', beforeContext );
                else
                    out = who;

                if(info.valueFlag)
                    afterContext.push(c.Literal('value'));


                for(i = 0, _i = afterContext.length; i < _i; i++)
                    out = c.MemberExpression(out, afterContext[i]);

                return out;

            },
                transformFnSet = function (node, stack, scope) {
                    var list = stack.slice().reverse(),
                        first = list[0];
                    var env = tools.isNameOfEnv(first.name, meta),
                        who;
                    if (env.type in primitives) {
                        who = ASTtransformer.craft.Identifier('self');
                    } else {
                        who = list.shift();
                    }
                    return {
                        'type': 'CallExpression',
                        'callee': {
                            'type': 'MemberExpression',
                            'computed': false,
                            'object': who,
                            'property': {
                                'type': 'Identifier',
                                'name': 'set'
                            }
                        },
                        'arguments': [
                            {
                                'type': 'ArrayExpression',
                                'elements':
                                    list.length ? list.map(function (item) {
                                        if (item.computed) {
                                            return scope.doTransform.call(scope.me, item, scope.options);
                                        } else {
                                            var out = {
                                                'type': 'Literal',
                                                'value': item.name,
                                                'raw': '\'' + item.name + '\''
                                            };
                                            if ('_id' in item)
                                                out._id = item._id;

                                            return out;
                                        }
                                    }) : [{
                                        'type': 'Literal',
                                        'value': 'value',
                                        'raw': '\'value\''
                                    }]


                            },
                            node.right
                        ]

                    };

                },
                options = {
                    variableTransformerSet: transformFnSet,
                    variableTransformerGet: transformFnGet
                },
                transformer = new ASTtransformer(),
                fn = fnObj.fn;
            fn = transformer.transform(fn.ast, fn.vars, options);
            return  'function(' + fnObj.args.join(',') + '){\n' + fn + '\n}';
        },
        indent: function (number, data) {
            if (!number)
                return data;

            var indent = (new Array(number + 1)).join('\t');
            if (Array.isArray(data))
                return data.map(function (line) {
                    return indent + line;
                });
            else
                return this.indent(number, data.split('\n')).join('\n');
        }
    };
    return tools;
})();