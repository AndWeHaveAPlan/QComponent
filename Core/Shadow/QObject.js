/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function() {
    'use strict';
    var tools = require('../Compile/tools');
    var VariableExtractor = require('../Compile/VariableExtractor'),
        ASTtransformer = require('../Compile/ASTtransformer');
    var itemFilter = function (item) {
        if (item.type === 'comment')
            return false;
        if (item.type !== 'text')
            throw new Error({type: 'Arguments parsing error', data: item});
        return true;
    },
        functionBody = {'->': true, '=>': true};

    return {
        /*using: ['Date', 'Number'],
        public: {
            name: {type: 'String', value: '234ewt', description: ''},
            olo: {type: 'Function', }
        },*/
        argumentParser: function (text, item) {

            var splitted = tools.split(item.items, ':', 2);

            return {name: tools.detox(tools.trim(splitted[0])), value: tools.detox(tools.trim(splitted[1]), true)};

        },
        eventParser: function (item, children) {            
            var splitted = tools.split(item.items, ':', 2);
            var events = tools
                .detox(splitted[0].filter(function(el){return el.type !== 'comment'}))
                .split(',')
                .map(function(text){return text.trim();})
                .join(',')
                .substr(1),
                fnInfo = this.functionParser(splitted[1], children);
            try {
                return {
                    events: events,
                    type: 'event',
                    args: fnInfo.args,
                    fn: fnInfo.fn,
                    vars: fnInfo.vars
                };
            }catch(e){
                throw {item: item, data: e, message: 'Syntax error'};
            }
        },
        functionParser: function (other, sub) {
            var i, _i, token,
                args = [],
                argsMatched,
                rest,
                fnStart,
                fn;

            for(i = 0, _i = other.length; i < _i; i++){

                token = other[i];
                if(token.type === 'comment')
                    continue;

                if(token.type === 'brace'){
                    if(argsMatched) {
                        if(token.info === '{'){
                            rest = token.items;
                            break;
                        }
                        throw {type: 'Arguments already matched', data: token};
                    }
                    args = tools
                        .detox(
                            token.items.filter(itemFilter)
                        )
                        .split(',')
                        .map(function(text){ return text.trim(); });
                    argsMatched = true;
                }
                if(token.type === 'text'){
                    if(token.pureData.trim().indexOf('function')===0)
                        continue;
                    if(token.pureData.trim()==='')
                        continue;
                    
                    fnStart = token.pureData.trim().substr(0,2);
                    if(functionBody[fnStart]){
                        rest = other.slice(i);
                        rest = tools.removeFirstWord({items: rest}, fnStart).items;
                        
                        /** if function body is in curly braces - extract it */
                        if(rest.length === 1 && rest[0].type === 'brace' && rest[0].info === '{')
                            rest = rest[0].items;
                        break;
                    }else{
                        throw new Error({message: {type: 'Syntax error', data: token}});
                    }
                }
            }
            fn = [
                rest.map(function(item){
                    if(item.type === 'comment')
                        return item.info === void 0 ? item.data+ '\n': item.data;
                    return item.pureData;
                })
                .join('')
            ];
            if(sub)
                fn = fn.concat(
                    sub.map(function (item) {
                        return item.pureLine;
                    })
                );
            fn = fn.join('\n');
            
            var parsed = VariableExtractor.parse(fn);
            var vars = parsed.getFullUnDefined();
            for( i = 0, _i = args.length; i < _i; i++)
                delete vars[args[i]];
            return {
                args: args,
                fn: new ASTtransformer().transform(parsed.getAST(), vars)
            };
        }
    };
})();
    
