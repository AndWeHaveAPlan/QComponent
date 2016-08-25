/**
 * Created by zibx on 14.07.16.
 */
module.exports = (function () {
    'use strict';
    var esprima,
        counter = 0;

    var getVars = function(node, list){
        if(!node) return;
        var type = node.type,
            extractor = extractors[type],
            scope = this instanceof Scope ? this : new Scope();
        if(!extractor){
            console.log('Node:', node);

            throw new Error('No extractor for type `'+ type +'`');
        }
        extractor.call(scope, node, list);
        return scope;
    };


    var setter = function(key, value){
        return function(el){
            el[key] = value;
        };
    };
    var rules = {
        'Program': '*body',
        'NewExpression': ['callee', '*arguments'],
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

    var extractors = {

        'VariableDeclaration': function(node){
            node.declarations.forEach(setter('kind', node.kind));
            node.declarations.map(getVars, this);
        },
        'VariableDeclarator': function(node){ // go to declared
            this.declare(node.id, node.init, node.kind);
            getVars.call(this,node.init);
        },
        'BlockStatement': function(node){
            node.body.map(getVars, this.extend('block'));
        },
        'CallExpression': function(node, list){
            getVars.call(this, node.calee, list);
            node.arguments.map(getVars, this);
            /*var scope;
            if(list && list.length) {
                list.push(node);
                /!*list = list.reverse();
                 (this.deepUsed[list[0].name] || (this.deepUsed[list[0].name] = {}))[
                 list.map(function(el){return el.name;})
                 ] = true;*!/
                //if(this.deepUsed.a && this.deepUsed.a['a,g']) debugger;
            }else {
                this.used[node.name] = true;
                if(list === void 0 || list === false || typeof list === 'number') {
                    scope = (this.deepUsed[node.name] || (this.deepUsed[node.name] = {}));
                    node._id = counter++;
                    (scope[node.name] || (scope[node.name] = [])).push(node);
                }
            }*/

            //'callee', '*arguments'
        },
        'MemberExpression': function(node, list){
            var needList = list !== false,
                wasList = !!list,
                scope, key;

            if(!needList || list === void 0)
                getVars.call(this, node.object, false);

            node.property.computed = node.computed;
            if(node.computed !== false)
                getVars.call(this, node.property);


            if(needList){
                list = list || [];
                list.push(node.property);
                getVars.call(this, node.object, list);
                if(!wasList && needList){
                    list = list.reverse();
                    scope = (this.deepUsed[list[0].name] || (this.deepUsed[list[0].name] = {}));
                    key = list.map(function(node){
                        if(node.type==='Literal')
                            return node.value.replace(/\./g,'\\.');
                        return (node.computed ? '~':'')+node.name;
                    }).join('.');
                    node._id = counter++;
                    (scope[key] || (scope[key] = [])).push(node);
                    /*list.map(function(node){
                            if(node.type==='Literal')
                                return {value: node.value, type: 'text', computed: false};
                            if(node.computed)
                                return {value: node.name, type: 'name', computed: true};
                            else
                                return {value: node.name, type: 'name', computed: false};
                        });*/
                }

            }
        },
        'FunctionExpression': function(node){
            var subScope = this.extend('function');
            getVars.call(subScope, {
                type: 'VariableDeclaration',
                declarations: node.params.map(function(param, i){
                    return {type: 'VariableDeclarator', id: param, init: node.defaults[i]};
                })
            });
            getVars.call(subScope,node.body);
        },
        'FunctionDeclaration': function(node){
            getVars.call(this, {type: 'VariableDeclarator', id: node.id, init: null});
            var subScope = this.extend('function');
            getVars.call(subScope, {
                type: 'VariableDeclaration',
                declarations: node.params.map(function(param, i){
                    return {type: 'VariableDeclarator', id: param, init: node.defaults[i]};
                })
            });
            getVars.call(subScope,node.body);
        },
        'Identifier': function(node, list){
            var scope;
            if(list && list.length) {
                list.push(node);
                /*list = list.reverse();
                 (this.deepUsed[list[0].name] || (this.deepUsed[list[0].name] = {}))[
                 list.map(function(el){return el.name;})
                 ] = true;*/
                //if(this.deepUsed.a && this.deepUsed.a['a,g']) debugger;
            }else {
                this.used[node.name] = true;
                if(list === void 0 || list === false || typeof list === 'number') {
                    scope = (this.deepUsed[node.name] || (this.deepUsed[node.name] = {}));
                    node._id = counter++;
                    (scope[node.name] || (scope[node.name] = [])).push(node);
                }
            }
        },
        'ThisExpression': function(node, list){
            var scope;
            if(list && list.length) {
                node.name = 'this';
                list.push(node);
                /*list = list.reverse();
                 (this.deepUsed[list[0].name] || (this.deepUsed[list[0].name] = {}))[
                 list.map(function(el){return el.name;})
                 ] = true;*/
                //if(this.deepUsed.a && this.deepUsed.a['a,g']) debugger;
            }else {
                this.used.this = true;
                if(list === void 0) {
                    scope = (this.deepUsed.this || (this.deepUsed.this = {}));
                    node._id = counter++;
                    (scope.this || (scope.this = [])).push(node);
                }
            }
        },
        'Literal': function(node, list){

            if(list && list.length) {
                list.push(node);
                /*list = list.reverse();
                 (this.deepUsed[list[0].name] || (this.deepUsed[list[0].name] = {}))[
                 list.map(function(el){return el.name;})
                 ] = true;*/
                //if(this.deepUsed.a && this.deepUsed.a['a,g']) debugger;
            }
        },
        'CatchClause': function(node){
            var subScope = this.extend('block');
            getVars.call(subScope, {
                type: 'VariableDeclaration',
                declarations: [node.param].map(function(param){
                    return {type: 'VariableDeclarator', id: param, init: null};
                })
            });
            getVars.call(subScope,node.body);
        }
    };

    (function () {
        var setExtractor = function(name){
            extractors[name] = fn(getVars);
        };
        for(var i in rules){
            if(rules.hasOwnProperty(i)){
                var val = rules[i];
                var fn = new Function('getVars', 'return function(node, e){' +
                    'var _self = this;'+
                    (val instanceof Array ? val : [val]).map(function(statement){
                        var each;
                        if(statement === null)return '';
                        (each = statement.charAt(0) === '*') &&
                        (statement = statement.substr(1));
                        if(each){
                            return 'node[\''+statement+'\'].map(function(el){' +
                                'getVars.call(_self, el, e)' +
                                '}, this);';
                        }else{
                            return 'getVars.call(this,node[\''+statement+'\'], e);';
                        }
                    }).join('\n')+';}');
                i.split(',').forEach(setExtractor);
            }
        }
    })();


    var Scope = function(){
        this.declared = {};
        this.used = {};
        this.deepUsed = {};
        this.subScopes = [];
        this.real = this;
    };

    var setters = {
        'Identifier': function(id, init, kind){

            this.declared[id.name] = init;


            //getVars.call(this, init, kind); // TODO: test this comment!
        },
        'ArrayPattern': function(ids, inits, kind){

            var i = 0, idEls = ids.elements,_i = idEls.length, id, init, initEls = inits.elements;
            for(;i<_i;i++){
                id = idEls[i];
                init = initEls ? initEls[i] : inits;

                if(id !== null){
                    if(id.type==='RestElement'){
                        this.declare(id.argument, initEls ? {elements: initEls.slice(i), type: 'ArrayExpression'} : inits, kind);
                    }else{
                        this.declare(id, init, kind);
                    }

                }
            }
        },
        'ObjectPattern': function(){
            //debugger;
        }
    };
    Scope.prototype = {
        parent: null,
        type: 'scope',
        real: null,
        extend: function(type){
            var subScope = new Scope();
            subScope.parent = this;
            subScope.type = type;
            subScope.real = type === 'block' ? this.real: subScope;
            this.addScope(subScope);
            return subScope;
        },
        findUsage: function(){

        },
        addScope: function(scope){
            this.subScopes.push(scope);

        },
        declare: function(id, init, kind){

            var type = id.type,
                setter = setters[type];

            if(!setter)
                throw new Error('No setter for `'+type+'`');


            setter.call(kind === 'let' ? this : this.real, id, init, kind);

        }
    };


    var apply = function(a, b){
        for(var i in b)
            a[i] = b[i];
        return a;
    };
    var getUnDefined = function(obj, collector){
        var i, used = obj.used, undef = {};
        collector = Object.create(collector || {});
        apply(collector, obj.declared);
        for(i in used)
            if(used.hasOwnProperty(i)){
                if(!(i in collector)){

                    undef[i] = true;
                }

            }
        obj.subScopes.forEach(function(scope){
            apply(undef, getUnDefined(scope, collector));
        });
        return undef;
    };
    var getFullUnDefined = function (obj, collector) {
        var deepUsed = obj.deepUsed;
        /*console.log(deepUsed);
        console.log(obj.used);
        console.log(Object.keys(obj.declared))*/

        var i, undef = {};
        collector = Object.create(collector || {});
        apply(collector, obj.declared);
        for(i in deepUsed)
            if(deepUsed.hasOwnProperty(i)){
                if(!(i in collector)){
                    apply(undef[i] || (undef[i] = {}),deepUsed[i]);
                }
            }

        obj.subScopes.forEach(function(scope){
            apply(undef, getFullUnDefined(scope, collector));
        });
        delete undef.Math;
        delete undef.console;
        //console.log(undef)
        delete undef.Date;
        delete undef.parseInt;
        return undef;

    };
    var extractor = {
        parse: function (sourceCode) {
            esprima = esprima || require('esprima');
            var parsed = esprima.parse(sourceCode);
            return {
                getVars: function(){
                    return getVars(parsed);
                },
                getUnDefined: function () {
                    return getUnDefined(this.getVars());
                },
                getFullUnDefined: function () {
                    return getFullUnDefined(this.getVars());
                },
                getAST: function(){
                    return parsed;
                }
            };
        },
        extractors: extractors,
        rules: rules
    };
    return extractor;
})();