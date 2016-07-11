/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function() {
    'use strict';
    var QObject = require('../../Base/QObject'),
        parser = require('../Parse/Parser'),
        shadow = require('../Shadow');
    
    var compiler = new QObject({
        KEYWORDS: {
            DEFINE: ['def', 'define'],
            PUBLIC: ['pub', 'public']
        },
        parsers: {
            DEFINE: function (text, item) {
                var tokens = text.trim().split(' ');/*,
                    info = compiler.linker(item.children); // TODO recursion should happens later

                info.type = tokens[0];
                info.name = tokens[1];*/

                //console.log('c',collected)

                return {type: tokens[0], name: tokens[1], item: item};//info;
            },
            PUBLIC: function (text, item) {
                var type = text.match(parser.nameRegexp)[0],
                    info, bonus = text.substr(text.indexOf(type)+type.length);

                type = type.trim();

                var shadowParser = shadow[type] && shadow[type].argumentParser || shadow.QObject.argumentParser;

                info = shadowParser(bonus, item);
                console.log(type, bonus, info)
                info.type = type;

                return info;
            }
        },
        linker: function(tree){
            var KEYWORDS = compiler.KEYWORDS,
                parsers = compiler.parsers,

                kw = {},
                defines = {},
                defineCheck = {},

                usage = {},

                publics = {},
                publicsCheck = {},

                i, _i, item, type, bonus, info,

                out = {
                    usage: usage,
                    publics: publics,
                    defines: defines
                };

            for( i in KEYWORDS )
                kw[i] = QObject.arrayToObject( KEYWORDS[i] );

            for(i = 0, _i = tree.length; i < _i; i++){
                item = tree[i];
                type = item.type;
                bonus = item.bonus;

                if(type in kw.DEFINE){
                    info = parsers.DEFINE(bonus, item);
                    usage[info.type] = true;
                    if(defineCheck[info.name])
                        throw new Error(info.name +' is already defined');

                    defines[info.name] = info;
                    defineCheck[info.name] = true;
                }else if(type in kw.PUBLIC){
                    info = parsers.PUBLIC(bonus, item);
                    usage[info.type] = true;
                    publics[info.name] = info;

                    if(publicsCheck[info.name])
                        throw new Error(info.name +' is already defined');
                    publicsCheck[info.name] = true;
                }else if(type in shadow){

                }
                //console.log(item.pureLine.match(nameRegexp));
            }

            return out;
        }
    });

    /*var tokens = parser.tokenizer(
    ),
        tree = parser.treeBuilder(tokens),
        linked = compiler.linker(tree);
    console.log(tree);
    console.log(JSON.stringify(linked,null,2));*/


    return compiler;
})();