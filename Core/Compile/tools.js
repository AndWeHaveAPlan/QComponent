/**
 * Created by zibx on 7/14/16.
 */
var tools = module.exports = (function() {
    'use strict';
    var trimLeft = function(text){
        return text.replace(/^\s+/, '');
    };
    var variableExtractor = require('./VariableExtractor'),
        QObject = require('../../Base').QObject;
    return {
        removeFirstWord: function (item, word) {
            var subItem = item.items[0], pos;
            subItem.data = subItem.data.substr(pos = subItem.data.indexOf(word) + word.length);
            subItem.col += pos;
            subItem.pureData = subItem.pureData.substr(subItem.pureData.indexOf(word) + word.length);

            if (subItem.data.length === 0)
                item.items.shift();
        },
        renderItems: function (items, pure) {
            if (items && items.map)
                return items.map(function (item) {
                    return item.col + ':' + ({
                            text: 'T',
                            comment: '%',
                            brace: '<',
                            quote: 'Q'
                        }[item.type]) + item[pure ? 'pureData' : 'data'].substr(0, 30);
                }).join('|');

        },
        detox: function (items, safe) {
            var i, _i = items.length, item, out = '';
            for(i = 0; i < _i; i++){
                item = items[i];
                if(item.type !== 'text') {
                    if (safe)
                        return items;
                    else
                        throw new Error('Invalid detox for `' + this.renderItems(items) + '`');
                }
                out += item.pureData;
            }
            return out;
        },
        trim: function (items) {
            var i = 0, _i = items.length, item,
                 out = [], trimd, notEmpty = false;
            for(;i<_i;i++){
                item = items[i];
                if(!notEmpty && item.type === 'text') {
                    if (item.pureData.trim() === '')
                        continue;
                    else if((trimd = trimLeft(item.pureData)) !== item.pureData) {
                        item = Object.create(item);
                        item.pureData = trimd;
                    }
                }
                out.push(item);
                notEmpty = true;
            }
            return out;
        },
        transformPipes: function (items) {
            var out = [], i, _i = items.length, item, data,
                unUsed, werePipes = false,
                pipedOut = {vars: {}, items: out, isPipe: true}, vars;

            for (i = 0, _i; i < _i; i++) {
                item = items[i];
                // oh, it's a pipe!
                if(item.type==='brace' && item.info==='{' && item.pureData.indexOf('{{')===0){
                    data = item.pureData.substr(2, item.pureData.length - 4);

                    unUsed = Object.keys(vars = variableExtractor.parse(data).getFullUnDefined());
                    if(unUsed.length){
                        werePipes = true;

                        QObject.apply(pipedOut.vars, vars);
                        out.push({type: 'fn', pureData: data});
                    }else{
                        try {
                            out.push({type: 'text', pureData: eval(data), col: item.col, row: item.row});
                        }catch(e){
                            throw new Error('Evaluation error: '+item.row+':'+item.col)
                        }
                    } //&& pipes.push({vars: unUsed, text: data});
                    //debugger;
                }else{
                    out.push(item);
                }
            }
            if(werePipes){
                pipedOut.fn = pipedOut.items.map(function (item) {
                    if(item.type === 'text')
                        return '\''+item.pureData+'\'';// TODO: escape
                    else
                        return item.pureData;
                }).join('+');
                //pipedOut.vars = pipedOut.vars;
                return pipedOut;
            }

            return out;
        },
        getPipes: function (items) {
            var pipes = [], i, _i = items.length, item, data, unUsed;
            for (i = 0, _i; i < _i; i++) {
                item = items[i];

                // oh, it's a pipe!
                if(item.type==='brace' && item.info==='{' && item.pureData.indexOf('{{')===0){
                    data = item.pureData.substr(2, item.pureData.length - 4);
                    unUsed = Object.keys(variableExtractor.parse(data).getFullUnDefined());
                    unUsed.length && pipes.push({vars: unUsed, text: data});
                    //debugger;
                }
            }
            return pipes;
        },
        /**
         * Split items by symbol
         */
        split: function (items, symbol, count, trim) {
            var parts = [], part = [], sliced = false,
                i, _i = items.length, tmp, tmpItem, item, alreadyCount = 1,
                symbol = symbol || ':',
                emptyCount = count === void 0;

            for (i = 0, _i; i < _i; i++) {
                item = items[i];
                if (item.type === 'text' && (emptyCount || alreadyCount < count)) {
                    if (( tmp = item.pureData.indexOf(symbol)) > -1) {
                        tmpItem = Object.create(item);
                        tmpItem.pureData = item.pureData.substr(0, tmp);
                        part.push(tmpItem);
                        parts.push(part);
                        if (!sliced) {
                            items = items.slice();
                            sliced = true;
                        }
                        tmpItem = Object.create(item);
                        tmpItem.pureData = item.pureData.substr(tmp + 1);
                        items[i] = tmpItem;
                        part = [];
                        i--;
                        alreadyCount++;
                    } else {
                        part.push(item);
                    }
                } else
                    part.push(item);
            }
            parts.push(part);
            if (parts.length < count)
                for (i = parts.length; i < count; i++)
                    parts.push([])
            if (trim) {
                for (i = parts.length; i;) {
                    part = parts[--i];
                    if (part.length) {
                        part = part[part.length - 1];
                        if (part.type === 'text')
                            part.pureData = part.pureData.replace(/\s*$/, '');

                        part = parts[i][0]
                        if (part[0] === 0)
                            part[1] = part[1].replace(/^\s*/, '');
                    }
                }
            }
            return parts;
        }
    };
})();