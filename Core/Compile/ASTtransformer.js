/**
 * Created by zibx on 8/12/16.
 */
module.exports = (function(){
    'use strict';
    var assert = require('chai').assert;
    var Core = require( '../../Core' );

    var QObject = Core.Base.QObject,
        escodegen = require('escodegen');

    var rules = {
        'BlockStatement': '*body',
        'Program': '*body',
        'NewExpression': ['callee', '*arguments'],
        'ExpressionStatement': 'expression',
        'ArrayExpression': '*elements',
        'ConditionalExpression,IfStatement': ['test', 'consequent', 'alternate'],
        'BreakStatement,EmptyStatement,ObjectPattern,DebuggerStatement': null,
        'BinaryExpression,LogicalExpression': ['left','right'],
        'ForInStatement': ['left','right','body'],
        'ThrowStatement,ReturnStatement,UnaryExpression': 'argument',
        'WhileStatement,DoWhileStatement': ['test', 'body'],
        'ForStatement': ['init','test','update','body'],
        'VariableDeclarator': 'init',
        'VariableDeclaration': '*declarations',
        'SwitchStatement': ['discriminant','*cases'],
        'SequenceExpression': ['*expressions'],
        'SwitchCase': ['test', '*consequent'],
        'ObjectExpression': ['*properties'],
        'Property': 'value',
        'TryStatement': ['block','*handlers']
    };


    var setter = function(key, value){
        return function(el){
            el[key] = value;
        };
    };

/*


*/

    var doTransform = function(node, options, parent){
        if(!node) return;

        var type = node.type,
            extractor = extractors[type];
//console.log(type)
        if(!extractor){
            throw new Error('No extractor for type `'+ type +'`');
        }
        return extractor.call(this, node, options, parent);
    };
    var generateNumber = function(value){
        return {
            type: 'Literal',
            value: value,
            raw: value
        };
    };
    var generateAssignment = function(node, operation, value){
        return {
            type: 'AssignmentExpression', operator: '=',
            left: Object.create(node),
            right: {
                type: 'BinaryExpression',
                operator: operation,
                left: node,
                right: value
            }
        };
    };
    var mapWrapper = function(scope, a, b, c){
        return function(item){
            return doTransform.call(scope, item, a, b, c);
        };
    };
    var extractors = {
        'UpdateExpression': function(node, options){
            if(node.prefix){
                return doTransform.call(this, node.argument, options, node);
            }else{
                return doTransform.call( this, generateAssignment(
                    node.argument,
                    node.operator.charAt(0),
                    generateNumber(1)
                ), options, node);
            }

        },
        'AssignmentExpression': function(node, options){

            node = Object.create(node);


            /** if variable is declared - do nothing */
            if(!('_id' in node.left) || !(node.left._id in this) || node.left._id === null) {
                node.right = doTransform.call(this,node.right, options, node);
                return node;
            }

            var _self = this;

            var pointer = node.left, stack = [];

            while(pointer.type !== 'Identifier' && pointer.type !== 'ThisExpression'){
                stack.push(pointer.property);
                pointer = pointer.object;
            }
            //stack.push(pointer.property);
            var tmp = escodegen.generate(node)
            if(node.operator !== '='){
                return doTransform.call(
                    this,
                    generateAssignment(
                        node.left, node.operator.substr(0, node.operator.length - 1),
                        node.right
                    ),
                    options, node
                );
            }
            node.right = doTransform.call(this, node.right, options, node);

            if(options.variableTransformerSet){
                stack.push(pointer);
                return options.variableTransformerSet(node, stack, {
                    me: _self,
                    options: options,
                    doTransform: doTransform
                }, node);
            }
            var out = {

                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": pointer,
                        "property": {
                            "type": "Identifier",
                            "name": "set"
                        }
                    },
                    "arguments": [
                        {
                            "type": "ArrayExpression",
                            "elements":
                                (stack.length ? stack.reverse().map(function(item){
                                    //console.log(JSON.stringify(item,null,2));
                                    if(item.computed){
                                        return doTransform.call(_self, item, options, node);
                                    }else{
                                        var out = {
                                            "type": "Literal",
                                            "value": item.name,
                                            "raw": "'"+item.name+"'"
                                        }; 
                                        if('_id' in item)
                                            out._id = item._id;
                                            
                                        return out; 
                                    }
                                }) : [{
                                    "type": "Literal",
                                    "value": 'value',
                                    "raw": "'value'"
                                }])


                        },
                        node.right
                    ]

            };
            //assert.deepEqual(node, out);
            return out;
        },
        'MemberExpression': function(node, options, parent){
            var _self = this;

            if( '_id' in node && node._id in this && node._id !== null ){
                //console.log(JSON.stringify(node,null,2));
                var ending = [], pointer = node, stack = [];
                //console.log(pointer, pointer.object)
                while(pointer.object.type !== 'Identifier' && pointer.object.type !== 'ThisExpression'){
                    stack.push(pointer.property);
                    pointer = pointer.object;
                }
                stack.push(pointer.property);

                if(options.variableTransformer){
                    stack.push(pointer.object);
                    return options.variableTransformer(node, stack);
                }

                if(options.variableTransformerGet){
                    stack.push(pointer.object);
                    return options.variableTransformerGet(node, stack, {
                        me: _self,
                            options: options,
                            doTransform: doTransform
                    }, parent);
                }

                return {
                        "type": "CallExpression",
                        "callee": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": pointer.object,
                            "property": {
                                "type": "Identifier",
                                "name": "get"
                            }
                        },
                        "arguments": [
                            {
                                "type": "ArrayExpression",
                                "elements":
                                    (stack.length ? stack.reverse().map(function(item){
                                        //console.log(JSON.stringify(item,null,2));
                                        if(item.computed){
                                            return doTransform.call(_self, item, options, node);
                                        }else{
                                            var out = {
                                                "type": "Literal",
                                                "value": item.name,
                                                "raw": "'"+item.name+"'"
                                            }; 
                                            if('_id' in item)
                                                out._id = item._id;

                                            return out; 
                                        }
                                    }) : [{
                                        "type": "Literal",
                                        "value": 'value',
                                        "raw": "'value'"
                                    }])
                            }
                        ]

                };
            }else {
                node = Object.create(node);

                node.object = doTransform.call(this, node.object, options, node);
                node.property = doTransform.call(this, node.property, options, node);
                return node;
            }
        },
        'FunctionExpression': function(node){
            return node; // TODO unshit
        },
        'CallExpression': function(node, options){
            if(node.callee.type === 'MemberExpression') {
                return {
                    "type": "CallExpression",
                    "callee": doTransform.call(this, node.callee, options, node)/*{
                        "type": "MemberExpression",
                        "computed": node.callee.computed,
                        "object": doTransform.call(this, node.callee.object, options),
                        "property": node.callee.computed ? // IF property is dynamic - try to get deeper
                            doTransform.call(this, node.callee.property, options) : node.callee.property
                    }*/,
                    "arguments": node.arguments.map(mapWrapper(this, options, node))
                };
            }else{
                return {
                    "type": "CallExpression",
                    "callee": doTransform.call(this, node.callee, options, node),
                    "arguments": node.arguments.map(mapWrapper(this, options, node))
                };
            }

        },
        'FunctionDeclaration': function(node){
            return node; // TODO unshit
        },
        'Identifier': function(node, options){
            if( '_id' in node && node._id in this && node._id !== null ){
                if(options.variableTransformer){
                    return options.variableTransformer(node);
                }
                if(options.variableTransformerGet){
                    return options.variableTransformerGet(node, [node]);
                }
                return {
                        "type": "CallExpression",
                        "callee": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": node,
                            "property": {
                                "type": "Identifier",
                                "name": "get"
                            }
                        },
                        "arguments": [
                            {
                                "type": "ArrayExpression",
                                "elements": [
                                    {
                                        "type": "Literal",
                                        "value": "value",
                                        "raw": "'value'"
                                    }
                                ]
                            }
                        ]
                };
            }else
                return node;
        },
        'ThisExpression': function(node, list){
            return node;
        },
        'Literal': function(node, list){
            return node;
        },
        'CatchClause': function(node){
            return node;
        }
    };

    (function () {
        var setExtractor = function(name){
            extractors[name] = fn(doTransform);
        };
        for(var i in rules){
            if(rules.hasOwnProperty(i)){
                var val = rules[i];
                var fn = new Function('doTransform', 'return function(node, options){' +
                    'node = Object.create(node); '+
                    (val instanceof Array ? val : [val]).map(function(statement){
                        var each;
                        if(statement !== null) {
                            (each = statement.charAt(0) === '*') &&
                            (statement = statement.substr(1));
                            if (each) {
                                return 'node[\'' + statement + '\'] = node[\'' + statement + '\'].map(function(item){' +
                                        'return doTransform.call(this, item, options, node);' +
                                    '}, this);';
                            } else {
                                return 'node[\'' + statement + '\'] = doTransform.call(this, node[\'' + statement + '\'], options, node);';
                            }
                        }
                    }).join('\n')+';return node;}');
                i.split(',').forEach(setExtractor);
            }
        }
    })();
    var ASTtransformer = function(){};
    ASTtransformer.prototype = {
        transform: function(esprimaTree, undefinedVarsStruct, options){
            var list = {}, scope, j;
            for(var i in undefinedVarsStruct){
                scope = undefinedVarsStruct[i];
                for(j in scope){
                    scope[j].forEach(function(item){
                        list[item._id] = item;
                    });
                }
            }
            options = options || {};

            var before = doTransform.call(list,esprimaTree, options);

            return escodegen.generate(before, options.escodegen);
        }

    };

    var craft = ASTtransformer.craft = {
        CallExpression: function(context, fnName, args){
            return {
                'type': 'CallExpression',
                'callee': {
                    'type': 'MemberExpression',
                    'computed': false,
                    'object': context,
                    'property': craft.Identifier(fnName)
                },
                'arguments': [
                    {
                        'type': 'ArrayExpression',
                        'elements': args
                    }
                ]
            };
        },
        MemberExpression: function(object, property){
            return {
                "type": "MemberExpression",
                "computed": false,
                "object": object,
                "property": property
            };
        },    
        Identifier: function(name){
            return {
                "type": "Identifier",
                "name": name
            };
        },
        js: function(tree, options){
            options = options || {};
            return escodegen.generate(tree, options.escodegen);
        },
        Literal: function(name){
            return {
                'type': 'Literal',
                'value': name,
                'raw': '\''+name+'\''
            };
        }
    };
    return ASTtransformer;
})();
/*list.length ? list.map(function (item) {
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
}]*/

