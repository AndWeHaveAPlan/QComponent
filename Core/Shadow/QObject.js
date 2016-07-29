/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function() {
    'use strict';
    var tools = require('../Compile/tools');
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
            return {events: events, type: 'event', args: fnInfo.args, fn: fnInfo.fn};

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
                    if(argsMatched)
                        throw new Error({type: 'Arguments already matched', data: token});
                    args = tools
                        .detox(
                            token.items.filter(itemFilter)
                        )
                        .split(',')
                        .map(function(text){return text.trim();});
                    argsMatched = true;
                }
                if(token.type === 'text'){
                    fnStart = token.pureData.trim().substr(0,2);
                    if(functionBody[fnStart]){
                        rest = other.slice(i);
                        tools.removeFirstWord({items: rest}, fnStart);
                        break;
                    }
                }
            }
            fn = [
                rest.map(function(item){
                    return item.pureData;
                })
                .join('')
            ].concat(
                sub.map(function (item) {
                    return item.pureLine;
                })
            );

            return {
                args: args,
                fn: fn.join('\n')
            };
        }
    };
})();
    
