/**
 * Created by zibx on 7/9/16.
 */
module.exports = (function() {
    'use strict';
    var QObject = require('../../Base/QObject'),
        parser = require('../Parse/Parser'),

        shadow = require('../Shadow'),
        path = require('path'),
        observable = require('z-observable'),
        tools = require('./tools');

    

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
                        info, bonus = text.substr(text.indexOf(type) + type.length),
                        newItem;

                    newItem = tools.removeFirstWord(item, type);

                    type = type.trim();

                    var shadowParser = shadow[type] && shadow[type].argumentParser || shadow.QObject.argumentParser;

                    info = shadowParser(bonus, newItem);
                    newItem.public = true;
                    newItem.type = info.type = type;
                    info.item = newItem;
                    return info;
                },
                PRIVATE: function(text, item){
                    var type = item.type,
                        shadowParser = shadow[type] && shadow[type].argumentParser || shadow.QObject.argumentParser,
                        info, newItem;
                    
                    info = shadowParser(text, newItem = tools.removeFirstWord(item, type));
                    info.item = newItem;
                    info.type = type;
                    return info;
                },
                EVENT: function (item, children) {
                    return shadow.QObject.eventParser(item, children);
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
                return mapped;
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
                    tokens = source.tokens = parser.tokenizer(code),

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
                        item.type = info.type;
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
                                private: {},
                                children: [],
                                pipes: []
                            };
                        }
                        if(type in shadow){
                            localShadow[type] = Object.create(shadow[type]);
                            this.applyIfNot(localShadow[type], {
                                defined: true,
                                subclasses: {},
                                public: {},
                                private: {},
                                children: [],
                                pipes: []
                            });

                        }else{
                            localShadow[type] = {
                                subclasses: {},
                                public: {},
                                depend: {},
                                private: {},
                                children: [],
                                pipes: []
                            };
                        }

                        localShadow[type].subclasses[j] = defs[j];
                        localShadow[j].depend[type] = true;
                        localShadow[j].type = type;
                    }
                }

                var isDefined = function(name){return (name in localShadow) && localShadow[name].defined; };

                for( i in depend ) if(depend.hasOwnProperty(i)){
                    //console.log(i, depend[i]);
                    if((i in localShadow) && localShadow[i].defined)
                        continue;

                    if(depend[i].filter(isDefined).length===depend[i].length){
                        //console.log('do', i);

                        this.extractSub(defines[i].item, localShadow, i, defines[i].id, localShadow[i], defines);


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
            isProperty: function(name, type, shadow){

                return shadow[type].public && (name in shadow[type].public ?
                    shadow[type].public[name] :
                    (shadow[type].type && this.isProperty(name, shadow[type].type, shadow)));
            },
            extractSub: function (sub, localShadow, name, fileName, childrenHolder, defines) {
                var children = sub.children,
                    i, _i, child, kw = {}, kws = {}, j,
                    KEYWORDS = this.KEYWORDS,
                    info,
                    parsers = this.parsers,
                    pipes,

                    isPublic, isProperty, isEvent,

                    type;

                for (i in KEYWORDS) {
                    kw[i] = QObject.arrayToObject(KEYWORDS[i]);
                    this.apply(kws, kw[i]);
                }

                for(i = 0, _i = children.length; i < _i; i++){
                    child = children[i];

                    isPublic = child.type in kw.PUBLIC;
                    isEvent = child.type.charAt(0) === '.';

                    if( isPublic ) {
                        info = parsers.PUBLIC.call(child, child.bonus, child);
                    }else if( isEvent ) {
                        info = parsers.EVENT.call(child, child, child.children); // TODO: wrap in try catch and generate normal errors
                    }else{
                        info = parsers.PRIVATE.call(child, child.bonus, child);
                    }
                    child = info.item;
                    if(isEvent) {
                        (childrenHolder.events || (childrenHolder.events = [])).push(info);
                    }else{
                        isProperty = !(info.type in kws) &&
                            (this.isProperty(info.type, sub.type, localShadow) ||
                                this.isProperty('default', sub.type, localShadow)
                            );

                        if (isProperty) {
                            info.name = info.type;
                            info.type = isProperty.type;
                        }
                        if (isPublic) {
                            if (!info.name.trim())
                                throw new Error('Public property `' + info.type + '` must be named (' + fileName + ':' + child.row + ':' + child.col + ')')
                            child.type = info.type;
                            child.public = true;
                            localShadow[name].depend[info.type] = true;
                            localShadow[name].public[info.name] = info;
                        } else {
                            if (info.name)
                                (childrenHolder.private || (childrenHolder.private = {}))[info.name] = info;
                        }
                        if (isProperty) {
                            (childrenHolder.prop || (childrenHolder.prop = {}))[info.name] = info;
                        } else {
                            childrenHolder.children.push(info);
                        }

                        if (!localShadow[child.type] ) {

                            if (info.type in shadow) {
                                localShadow[name].depend[child.type] = true;
                                localShadow[child.type] = shadow[child.type];
                                //console.log('!!', child.type);
                            } else if (!isProperty){
                                throw new Error('Unknown class `' + child.type + '` (' + fileName + ':' + child.row + ':' + child.col + ')');
                            }
                        }

                        /** extract subs in dependence */
                        if ((!localShadow[info.type] || !localShadow[info.type].defined)) {

                            var firstNeed = defines[info.type] || (defines[info.type] = shadow[info.type]);
                            if (firstNeed === void 0)
                                throw new Error('Unknown class `' + info.type + '` (' + fileName + ':' + child.row + ':' + child.col + ')');

                            if (firstNeed.type) {
                                var firstNeedType = defines[firstNeed.type];

                                if (firstNeedType === void 0)
                                    throw new Error('Unknown class parent `' + defines[info.type].type + '` (' + fileName + ':' + child.row + ':' + child.col + ')');

                                if (!firstNeedType.defined) {
                                    type = defines[info.type].type;
                                    this.extractSub(defines[type].item, localShadow, type, defines[type].id, localShadow[type], defines);
                                }
                            }
                            if (!firstNeed.defined) {
                                type = info.type;
                                this.extractSub(defines[type].item, localShadow, type, defines[type].id, localShadow[type], defines);
                            }
                        }

                        /** searching for pipes */
                        for (j in info) {
                            if (info[j] instanceof Array) {
                                try {
                                    pipes = tools.transformPipes(info[j]);
                                }catch(e){

                                    throw new Error('Reactive expression error `'+ e.message +'` (' + fileName + ':' +
                                        (e.item.row+e.data.lineNumber-1) + ':' +
                                        (e.data.lineNumber===1?e.item.col+2+e.data.column:e.data.column) + ')');
                                }
                                if (pipes.isPipe) {
                                    info[j] = pipes;
                                    localShadow[name].pipes = localShadow[name].pipes.concat(pipes.vars);

                                    (info._pipes || (info._pipes = {}))[info.name] = pipes;
                                    (child.pipes || (child.pipes = {}))[info.name/*maybe j*/] = pipes;
                                }
                            }
                        }

                        //console.log(child.type)

                        if (child.children && !localShadow[info.type].rawChildren) {
                            info.children = [];

                            this.extractSub(child, localShadow, name, fileName, info, defines);
                        }
                    }
                }
                if(childrenHolder === localShadow[name])
                    localShadow[name].defined = true;

            }
        };
    Linker.prototype = new QObject(Linker.prototype);

    return Linker;
})();