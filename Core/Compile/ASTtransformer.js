/**
 * Created by zibx on 8/12/16.
 */
module.exports = (function(){
    'use strict';
    var Core = require( '../../Core' );

    var QObject = Core.Base.QObject,
        escodegen = require('escodegen'),
        VariableExtractor = Core.Compile.VariableExtractor;

    var rules = {
        'Program': '*body',
        'CallExpression,NewExpression': ['callee', '*arguments'],
        'ExpressionStatement': 'expression',
        'ArrayExpression': '*elements',
        'ConditionalExpression,IfStatement': ['test', 'consequent', 'alternate'],
        'BreakStatement,EmptyStatement,ObjectPattern,DebuggerStatement': null,
        'AssignmentExpression,BinaryExpression,LogicalExpression': ['left','right'],
        'ForInStatement': ['left','right','body'],
        'UnaryExpression,ThrowStatement,ReturnStatement,UpdateExpression': 'argument',
        'WhileStatement,DoWhileStatement': ['test', 'body'],
        'ForStatement': ['init','test','update','body'],
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

    var doTransform = function(node, list){
        if(!node) return;

        var type = node.type,
            extractor = extractors[type];

        if(!extractor){
            throw new Error('No extractor for type `'+ type +'`');
        }
        return extractor.call(node, list);
    };
    var extractors = {
        'VariableDeclaration': function(node){
        },
        'VariableDeclarator': function(node){
        },
        'BlockStatement': function(node){
        },
        'MemberExpression': function(node, list){
        },
        'FunctionExpression': function(node){
        },
        'FunctionDeclaration': function(node){
        },
        'Identifier': function(node, list){
        },
        'ThisExpression': function(node, list){
        },
        'Literal': function(node, list){
        },
        'CatchClause': function(node){
        }
    };

    (function () {
        var setExtractor = function(name){
            extractors[name] = fn(doTransform);
        };
        for(var i in rules){
            if(rules.hasOwnProperty(i)){
                var val = rules[i];
                var fn = new Function('doTransform', 'return function(node){console.log(node);'+
                    (val instanceof Array ? val : [val]).map(function(statement){
                        var each;
                        if(statement === null)return '';
                        (each = statement.charAt(0) === '*') &&
                        (statement = statement.substr(1));
                        if(each){
                            return 'node[\''+statement+'\'].map(doTransform, this);';
                        }else{
                            return 'doTransform.call(this,node[\''+statement+'\']);';
                        }
                    }).join('\n')+';}');
                i.split(',').forEach(setExtractor);
            }
        }
    })();
    var ASTtransformer = function(){};
    ASTtransformer.prototype = {
        transform: function(esprimaTree, undefinedVarsStruct){
            var list = {}, scope, j;
            for(var i in undefinedVarsStruct){
                scope = undefinedVarsStruct[i];
                for(j in scope){
                    scope[j].forEach(function(item){
                        list[item._id] = item;
                    });
                }
            }

            doTransform(esprimaTree, list)
            debugger;
            console.log(escodegen.generate(esprimaTree))
        }
    };
    return ASTtransformer;
})();

