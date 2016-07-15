/**
 * Created by zibx on 7/9/16.
 */
module.exports = (function() {
    'use strict';
    var QObject = require('../../Base/QObject'),
        parser = require('../Parse/Parser'),

        shadow = require('../Shadow'),
        path = require('path'),
        observable = require('z-observable');

    var Linker = function (cfg) {
            this.apply(cfg);
            this.sources = {};
            this.observer = new observable();
            this.observer.on('defined', function (a,b) {
                console.log(a,b)
            })
        },
        linker = Linker.prototype = {
            shadow: {},
            KEYWORDS: {
                DEFINE: ['def', 'define'],
                PUBLIC: ['pub', 'public']
            },
            parsers: {

                DEFINE: function (text, item) {
                    var tokens = text.trim().split(' ');
                    /*,
                     info = compiler.linker(item.children); // TODO recursion should happens later

                     info.type = tokens[0];
                     info.name = tokens[1];*/

                    //console.log('c',collected)

                    return {type: tokens[0], name: tokens[1], item: item};//info;
                },
                PUBLIC: function (text, item) {
                    var type = text.match(parser.nameRegexp)[0],
                        info, bonus = text.substr(text.indexOf(type) + type.length);

                    type = type.trim();

                    var shadowParser = shadow[type] && shadow[type].argumentParser || shadow.QObject.argumentParser;

                    info = shadowParser(bonus, item);
                    console.log(type, bonus, info)
                    info.type = type;

                    return info;
                }
            },
            mapping: {
                id: 'path',
                code: 'data'
            },
            get: function (name, item) {
                var mapping = this.mapping;
                var field = name in mapping ? mapping[name] : name;
                if (typeof field === 'string')
                    return item[field];
                else if (typeof field === 'function')
                    return field.call(item);
            },
            add: function (item) {
                var mapping = this.mapping,
                    mapped = new observable(), i;
                for (i in mapping)
                    mapped[i] = this.get(i, item);

                this.sources[mapped.id] = mapped;
                this._sourceAdded(mapped);
            },
            _sourceAdded: function (source) {
                // TODO make source observable.
                // fire events defined and hash of global defines and perfile define.
                // in source make list of its defines. remove on remove.
                // listen class global defines and continue parsing from that position
                var code = source.code,
                    tokens = parser.tokenizer(code),
                    tree = parser.treeBuilder(tokens),
                    KEYWORDS = this.KEYWORDS,
                    parsers = this.parsers,

                    kw = {},
                    defines = source.defines = {},
                    defineCheck = {},

                    usage = source.usage = {},

                    publics = {},
                    publicsCheck = {},

                    i, _i, item, type, bonus, info,

                    out = {
                        usage: usage,
                        publics: publics,
                        defines: defines
                    };
                source.defines = defines;
                source.usage = usage;
                for (i in KEYWORDS)
                    kw[i] = QObject.arrayToObject(KEYWORDS[i]);

                for (i = 0, _i = tree.length; i < _i; i++) {
                    item = tree[i];
                    type = item.type;
                    bonus = item.bonus;

                    if (type in kw.DEFINE) {
                        info = parsers.DEFINE.call(source, bonus, item);
                        usage[info.type] = true;
                        if (defineCheck[info.name])
                            throw new Error(info.name + ' is already defined');

                        this.observer.fire('defined', info.name);
                        defines[info.name] = info;
                        info.path = source.id;
                        defineCheck[info.name] = true;
                    }/* else if (type in kw.PUBLIC) {
                        info = parsers.PUBLIC(bonus, item);
                        usage[info.type] = true;
                        publics[info.name] = info;

                        if (publicsCheck[info.name])
                            throw new Error(info.name + ' is already defined');
                        publicsCheck[info.name] = true;
                    } else if (type in shadow) {

                    }*/
                    //console.log(item.pureLine.match(nameRegexp));
                }
//console.log(out)
                //return out;

            },
            getMetadata: function(){
                var i, j, _j, k,
                    sources = this.sources, source,
                    defines, type, usage,
                    localShadow = this.shadow = {},
                    observe = new observable(),

                    allDefines = {};
                //console.log(this.sources)
                //return;

                for(i in sources){
                    source = sources[i];
                    defines = source.defines;
                    usage = source.usage;

                    for( j in defines ){
                        allDefines[j] = defines[j];
                    }

                    for( j in usage ){
                        if(j in shadow){
                            if(!(j in localShadow))
                                localShadow[j] = Object.create(shadow[j]);

                            localShadow[j].defined = true;

                            for( k in source.defines )
                                (localShadow[j].subclasses || (localShadow[j].subclasses = [])).push(k);
                        }else{
                            localShadow[j] = {};
                            for( k in source.defines )
                                (localShadow[j].subclasses || (localShadow[j].subclasses = [])).push(k);
                        }
                    }
                }

                // after knowing all defines - try to parse their data

                for(i in localShadow){
                    if(localShadow[i].defined){
                        var subs = localShadow[i].subclasses;
                        for(j = 0, _j = subs.length; j < _j; j++){
                            this.extractPublic(allDefines[subs[j]].item);
                        }
                    }
                }


                //console.log(localShadow)
                //console.log(allDefines);
            },
            extractPublic: function (sub) {
                var tree = sub.children, i, _i,
                    parsers = this.parsers,
                    item,
                    bonus, info, type,
                    KEYWORDS = this.KEYWORDS, kw = {},

                    usage = {},

                    publics = {},
                    publicsCheck = {},
                    out = {
                        usage: usage,
                        publics: publics
                    };

                for( i in KEYWORDS )
                    kw[i] = QObject.arrayToObject( KEYWORDS[i] );

                for(i = 0, _i = tree.length; i < _i; i++){
                    item = tree[i];
                    //console.log(item)
                    type = item.type;
                    bonus = item.bonus;

                    if(type in kw.PUBLIC){
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

                console.log('!',out);
            },
            remove: function (item) {
                var id = this.get('id', item);
                delete this.sources[id];
            }
        };
    Linker.prototype = new QObject(Linker.prototype);

    return Linker;
})();