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
        },
        comment: function(){
            return '';
        }
    },
        typedExtractors = {
            'Function': function (token, type, cls) {
                var t = shadow.QObject.eventParser(type.item, type.item.children);
                return tools.functionTransform(t, cls);
            }/*,
            'Number': function(token, type, cls){
                return 5;
            }*/
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
            var type = propList._prop && propList._prop[prop];
            //&& propList._prop[prop].prototype;
            return type ? type.type : false;
        },
        dataExtractor: function (prop, cls) {
            var type = prop.type;
            var val = prop.value,
                out;
            if (typeof val === 'string') {
                out = extractor({ type: 'text', pureData: val }, prop, cls);
            } else {

                if (type === 'Function') // TODO this is the place where typed extractors should leave and throw errors
                    out = extractor(val[0], prop, cls);
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
                    return cls.subcls(prop).compile(true).join('\n');
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
                if (metadata.public) { // it is shadow
                    if (metadata.public[name])
                        return metadata.public[name];
                    else {
                        if (metadata.private) {
                            if (metadata.private[name])
                                return metadata.private[name];
                            else
                                return false;
                        }
                    }
                } else
                        throw new Error('Corrupted metadata for `' + name + '`');
                }
            prop = metadata._prop;
            
            if(!prop)
                return false;
            
            if (prop[name])
                return prop[name];
            if (prop['default'])
                return prop['default'];
            if (prop['_unknownProperty']) {
                tmp = prop['_unknownProperty'](name);
                if (tmp)
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
                    for (var i = 0, _i = pipeVars.length; i < _i; i++) {
                        var pipeVar = pipeVars[i];
                        //var source;// = '\'' + fullName + '\'';
                        var source = tools.getVarAccessor(pipeVar, cls, scope);
                        if (!cache[source]) {
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
        getVarInfo: function (stack, cls, child) {
            var metadata = cls.metadata;
            var i, _i, out = [], node, env, selfFlag = false, context = false,
                envFlag, propFlag, valueFlag = false, thisFlag = false, lastEnv, lastName,

                firstTry = true,


                name;
            for (i = 0, _i = stack.length; i < _i; i++) {

                envFlag = propFlag = false;

                node = stack[i];
                if (node.type === 'Literal')
                    name = node.value;
                else
                    name = node.name;

                if (!env || env.type !== 'Variant') {

                    if (node.type === 'ThisExpression') {
                        env = child;
                        thisFlag = true;
                    } else {

                        env = this.isNameOfEnv(name, metadata);
                        if (env)
                            envFlag = true;
                    }

                    if (env && i === 0 && env.type in primitives) { // first token is from `self`
                        selfFlag = true;
                    }

                    if (!env) {
                        env = this.isNameOfProp(name, metadata);

                        if (!env)
                            env = this.isNameOfProp(name, shadow[metadata.type]);

                        if (env)
                            propFlag = true;
                    }

                    if (!env) {
                        if(firstTry){
                            // on first search we can try to find prop in root parent info
                            metadata = cls.root.metadata;
                            if(metadata){
                                i--;
                                firstTry = false;
                                continue;
                            }

                        }
                        if (lastEnv) {
                            console.log(out);
                            throw new Error('Can not resolve `' + name + '` from `' + lastName + '` <' + lastEnv.type + '>');
                        } else
                            throw new Error('Unknown variable `' + name + '`');
                    }
                }
                if (env.type in primitives) {
                    metadata = shadow[env.type];
                    if (context === false) {
                        context = i;
                        // we need to keep context
                        if (env.type === 'Function')
                            context--;
                    }
                    //if(i < _i - 1)
                    //    throw new Error('Can not get `'+ stack[i+1].name +'` of primitive value `'+node.name+'` <'+env.type+'>')
                } else {
                    metadata = shadow[env.type];
                    if(!metadata)
                        metadata = cls.root.scope.metadata[env.type];
                    if(!metadata)
                        debugger;
                }
                out.push({ name: name, env: envFlag, prop: propFlag, node: node, e: env });
                lastEnv = env;
                lastName = name;
                firstTry = false;
            }
            if (!(env.type in primitives || env.type === 'Variant')) {
                valueFlag = true;
            }
            if (out[0].prop)
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
            if (pointer.object) {

                while (pointer.object) {
                    stack.push(pointer.property);
                    pointer = pointer.object;
                }
                stack.push(pointer);
                stack = stack.reverse();
            } else {
                stack.push(pointer);
            }

            info = tools.getVarInfo(stack, cls);
            if (info.valueFlag)
                info.varParts.push({ name: 'value' });
            return (info.self ? 'self.id+\'.' : '\'') + info.varParts.map(function (el) { return el.name; }).join('.') + '\'';
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

                    var fnBody = tools.functionTransform(event, cls, child);
                    out.push((name || 'this') + '.on(\'' + event.events + '\',' + fnBody + ', ' + (name || 'this') + ');');
                }

                //out += '\t\t\tthis._subscribeList.push(this.removableOn(\'' + evt.events + '\', function(' + evt.args.join(',') + '){\n' + evt.fn + '\n}, this));\n';
                //out += '\t\t};\n';
                //out += '\t\tthis._subscr();\n';
                return out;
            }

        },
        functionTransform: function (fnObj, cls, child) {
            var meta = cls.metadata;
            var transformFnGet = function (node, stack, scope, parent) {
                var c0 = cls;
                var list = stack.slice().reverse(),
                    varParts,

                    info = tools.getVarInfo(list, cls, child),
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
                if (info.context === false)
                    info.context = info.varParts.length - 1;

                for (i = 0, _i = varParts.length; i < _i; i++) {
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

                    if (i <= info.context)
                        beforeContext.push(varItem);
                    else
                        afterContext.push(item.node);
                }

                var c = ASTtransformer.craft, // craft short link
                    out;//
                if (info.valueFlag)
                    if (!afterContext.length) {
                        beforeContext.push(c.Literal('value'));
                    } else {
                        afterContext.push(c.Literal('value')); // TODO
                    }

                if (beforeContext.length)
                    out = c.CallExpression(who, 'get', beforeContext);
                else
                    out = who;

                /*if (info.valueFlag)
                    afterContext.push(c.Literal('value')); // TODO*/

                for (i = 0, _i = afterContext.length; i < _i; i++)
                    out = c.MemberExpression(out, afterContext[i]);

                return out;

            },
                transformFnSet = function (node, stack, scope) {
                    var c0 = cls;
                    var list = stack.slice().reverse(),
                        varParts,

                        info = tools.getVarInfo(list, cls, child),
                        firstToken = info.varParts[0],
                        who;

                    //    first = list[0];
                    // var env = tools.isNameOfEnv(first.name, meta),
                    //     who;
                    if (info.self) {
                        who = ASTtransformer.craft.Identifier('self');
                    } else {
                        info.context--;
                        info.varParts.shift();
                        who = info.thisFlag ? ASTtransformer.craft.This() : ASTtransformer.craft.Identifier(firstToken.name);
                    }
                    if (info.valueFlag)
                        info.varParts.push({name: 'value'})

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
                                    info.varParts.map(function (item) {
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
                                    })
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
            return 'function(' + fnObj.args.join(',') + '){\n' + fn + '\n}';
        },
        pad: function(number, symbol){
            return new Array(number+1).join(symbol||' ');
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
        },
        /**
         * Binary search
         * @param arr - array of elements
         * @param val - value
         * @param key - key that contains value
         * @returns {number|*}
         */
        findIndexBefore: function( arr, val, key ){
            var l1 = 0,
                delta = arr.length,
                floor = Math.floor,
                place;
            while( delta > 1 ){
                delta = delta / 2;
                if( arr[floor(l1 + delta)][key] <= val ){
                    l1 += delta;
                }
            }
            place = floor(l1+delta)-1;
            return place;
        },
        variableNameRegex: /^[$A-Z\_a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc][$A-Z\_\-a-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc0-9\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19b0-\u19c0\u19c8\u19c9\u19d0-\u19d9\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2-\u1cf4\u1dc0-\u1de6\u1dfc-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f1\ua900-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f]*$/
    };
    return tools;
})();