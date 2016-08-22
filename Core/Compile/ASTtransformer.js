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
        'BlockStatement,Program': '*body',
        'CallExpression,NewExpression': ['callee', '*arguments'],
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

    var doTransform = function(node){
        if(!node) return;

        var type = node.type,
            extractor = extractors[type];
//console.log(type)
        if(!extractor){
            throw new Error('No extractor for type `'+ type +'`');
        }
        return extractor.call(this, node);
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
/*

    var UpdateExpressionDSL = {
        '--': '-',
        '++': '+',

    };
*/

    var extractors = {
        'UpdateExpression': function(node){
            if(node.prefix){
                return doTransform.call(this, node.argument);
            }else{
                return doTransform.call( this, generateAssignment(
                    node.argument,
                    node.operator.charAt(0),
                    generateNumber(1)
                ));
            }

        },
        'AssignmentExpression': function(node){

            node = Object.create(node);


            /** if variable is declared - do nothing */
            if(!('_id' in node.left) || !(node.left._id in this)) {
                node.right = doTransform.call(this,node.right);
                return node;
            }

            var _self = this;

            var pointer = node.left, stack = [];

            while(pointer.type !== 'Identifier' && pointer.type !== 'ThisExpression'){
                stack.push(pointer.property);
                pointer = pointer.object;
            }
            //stack.push(pointer.property);

            if(node.operator !== '='){
                return doTransform.call(this, generateAssignment(node.left, node.operator.substr(0, node.operator.length - 1), node.right));
            }
            node.right = doTransform.call(this,node.right);
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
                                        return doTransform.call(_self, item);
                                    }else{
                                        return {
                                            "type": "Literal",
                                            "value": item.name,
                                            "raw": "'"+item.name+"'"
                                        }
                                    }
                                    return item;
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
        'MemberExpression': function(node){
            var _self = this;
            do {
                if ('_id' in node && node._id in this) {
                    //console.log(JSON.stringify(node,null,2));
                    var ending = [], pointer = node, stack = [];
                    console.log(pointer, pointer.object)
                    while (pointer.object.type !== 'Identifier' && pointer.object.type !== 'ThisExpression') {
                        if (pointer.object.type === 'CallExpression') break;

                        stack.push(pointer.property);
                        pointer = pointer.object;
                    }
                    stack.push(pointer.property);

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
                                "elements": (stack.length ? stack.reverse().map(function (item) {
                                    //console.log(JSON.stringify(item,null,2));
                                    if (item.computed) {
                                        return doTransform.call(_self, item);
                                    } else {
                                        return {
                                            "type": "Literal",
                                            "value": item.name,
                                            "raw": "'" + item.name + "'"
                                        }
                                    }
                                    return item;
                                }) : [{
                                    "type": "Literal",
                                    "value": 'value',
                                    "raw": "'value'"
                                }])
                            }
                        ]

                    };
                }
            }while(false);
            node = Object.create(node);
            node.object = doTransform.call(this,node.object);
            node.property = doTransform.call(this,node.property);
            return node;

        },

        'Identifier': function(node){
            if('_id' in node && node._id in this){
                console.log(node)
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
        'FunctionExpression': function(node){
            return node;
        },
        'FunctionDeclaration': function(node){
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
                var fn = new Function('doTransform', 'return function(node){node = Object.create(node); '+
                    (val instanceof Array ? val : [val]).map(function(statement){
                        var each;
                        if(statement !== null) {
                            (each = statement.charAt(0) === '*') &&
                            (statement = statement.substr(1));
                            if (each) {
                                return 'node[\'' + statement + '\'] = node[\'' + statement + '\'].map(doTransform, this);';
                            } else {
                                return 'node[\'' + statement + '\'] = doTransform.call(this,node[\'' + statement + '\']);';
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


            var before = doTransform.call(list,esprimaTree);

            return escodegen.generate(before, {
                format: options || {}
            });
        }

    };
    return ASTtransformer;
})();

