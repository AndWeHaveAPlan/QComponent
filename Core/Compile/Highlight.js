/**
 * Created by zibx on 04.08.16.
 */
module.exports = (function () {
    'use strict';
    var Highlighters = {
        text: function(item, meta){
            //console.log(item)
            return item ? item.pureData :'';
        },
        quote: function(item, meta){
            return 99
        },
        brace: function(item, meta){
            return item.info
        },
        comment: function(item, meta){

        }
    };
    var Highlight = function(metadata){
        this.meta = metadata;
    };
    Highlight.prototype = {
        high: function(obj){
            var meta = this.metadata, out = '';
            out += obj.map(function(line){
                console.log(line);
                return line.items.map(function(item){

                    return Highlighters[item.type](item, meta);
                }).join('');
            }).join('\n');

            return out;
        }
    };
    return Highlight;
})();