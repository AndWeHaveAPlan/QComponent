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

    var removeFirstWord = function (item, word) {
        var subItem = item.items[0], pos;
        subItem.data = subItem.data.substr(pos = subItem.data.indexOf(word)+word.length);
        subItem.col += pos;
        subItem.pureData = subItem.data.substr(subItem.pureData.indexOf(word)+word.length);

        if(subItem.data.length === 0)
            item.items.shift();
    };

    var Linker = function (cfg) {
            this.apply(cfg);
            this.sources = {};
            /*this.observer = new observable();
            this.observer.on('defined', function (a,b) {
                console.log(a,b)
            })*/
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

                    removeFirstWord(item, type);

                    type = type.trim();

                    var shadowParser = shadow[type] && shadow[type].argumentParser || shadow.QObject.argumentParser;

                    info = shadowParser(bonus, item);
                    item.public = true;
                    item.type = info.type = type;

                    return info;
                },
                PRIVATE: function(text, item){
                    var type = item.type,
                        shadowParser = shadow[type] && shadow[type].argumentParser || shadow.QObject.argumentParser,
                        info;
                    removeFirstWord(item, type);
                    info = shadowParser(text, item);

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
            /**
             * Find defines
             * @param source - {code: source, }
             * @private
             */
            _sourceAdded: function (source) {
                // TODO make source observable.
                // fire events defined and hash of global defines and perfile define.
                // in source make list of its defines. remove on remove.
                // listen class global defines and continue parsing from that position
                var code = source.code,

                    // tokenize
                    tokens = parser.tokenizer(code),

                    // build tree
                    tree = parser.treeBuilder(tokens),
                    KEYWORDS = this.KEYWORDS,
                    parsers = this.parsers,

                    kw = {},
                    defines = source.defines = {},
                    defineCheck = {},
                    usage = source.usage = {},

                    i, _i, item, type, bonus, info;

                for (i in KEYWORDS)
                    kw[i] = QObject.arrayToObject(KEYWORDS[i]);

                // find defines
                for (i = 0, _i = tree.length; i < _i; i++) {
                    item = tree[i];
                    type = item.type;
                    bonus = item.bonus;

                    if (type in kw.DEFINE) {
                        info = parsers.DEFINE.call(source, bonus, item);
                        usage[info.type] = true;
                        if (defineCheck[info.name])
                            throw new Error(info.name + ' is already defined');
                        defines[info.name] = info;
                        defineCheck[info.name] = true;
                    }
                }


            },
            getMetadata: function(){
                var i, j,
                    sources = this.sources, source, defs, type,
                    localShadow = this.shadow = {},

                // define depends on 1 .. bunch of classes
                    depend = {},
                    subclasses = {},
                    defines = {};

                for(i in sources){
                    source = sources[i];
                    defs = source.defines;

                    for( j in defs ){
                        defs[j].id = source.id;
                        type = defs[j].type;

                        defines[j] = defs[j];
                        (depend[j] || (depend[j] = [])).push(type);
                        (subclasses[type] || (subclasses[type] = [])).push(j);


                        if(!(j in localShadow)) {
                            localShadow[j] = {
                                subclasses: {},
                                public: {},
                                depend: {},
                                private: {}
                            };
                        }
                        if(type in shadow){
                            localShadow[type] = Object.create(shadow[type]);
                            this.apply(localShadow[type], {
                                defined: true,
                                subclasses: {},
                                public: {},
                                private: {}
                            });

                        }else{
                            localShadow[type] = {
                                subclasses: {},
                                public: {},
                                depend: {},
                                private: {}
                            };
                        }

                        localShadow[type].subclasses[j] = defs[j];
                        localShadow[j].depend[type] = true;
                        localShadow[j].type = type;
                    }
                }

                var isDefined = function(name){return (name in localShadow) && localShadow[name].defined; };

                var subInfo;
                for( i in depend ) if(depend.hasOwnProperty(i)){
                    //console.log(i, depend[i]);
                    if((i in localShadow) && localShadow[i].defined)
                        continue;

                    if(depend[i].filter(isDefined).length===depend[i].length){
                        //console.log('do', i);

                        subInfo = this.extractSub(defines[i].item, localShadow, i,defines[i].id);


                    }
                }
                return localShadow;

                /*console.log(depend);
                console.log(subclasses);
                console.log(localShadow);
                console.log(defines)*/
            },
            remove: function (item) {
                var id = this.get('id', item);
                delete this.sources[id];
            },
            extractSub: function (sub, localShadow, name,fileName) {
                var children = sub.children,
                    i, _i, child, kw = {},
                    KEYWORDS = this.KEYWORDS,
                    info,
                    parsers = this.parsers,

                    isPublic;

                for (i in KEYWORDS)
                    kw[i] = QObject.arrayToObject(KEYWORDS[i]);

                for(i = 0, _i = children.length; i < _i; i++){
                    child = children[i];

                    isPublic = child.type in kw.PUBLIC;
                    if( isPublic ){
                        info = parsers.PUBLIC.call(child, child.bonus, child);

                        child.type = info.type;
                        child.public = true;
                        localShadow[name].depend[info.type] = true;
                        localShadow[name].public[info.name] = info;
                    }
                    if(!localShadow[child.type]) {
                        if(child.type in shadow) {
                            localShadow[name].depend[child.type] = true;
                            localShadow[child.type] = shadow[child.type];
                            //console.log('!!', child.type);
                        }else {
                            //console.log(child)
                            throw new Error('Unknown class `' + child.type + '` (' + fileName + ':' + child.row + ':' + child.col + ')');
                        }
                    }
                    if( !isPublic ){
                        info = parsers.PRIVATE.call(child, child.bonus, child);
                        debugger;
                        console.log(info, child.rawLine)
                        localShadow[name].private[info.name] = info;
                    }

                    //console.log(child.type)
                    child.children  && !localShadow[child.type].rawChildren && this.extractSub(child,localShadow, name, fileName);
                }

                console.log();
            }
        };
    Linker.prototype = new QObject(Linker.prototype);

    return Linker;
})();