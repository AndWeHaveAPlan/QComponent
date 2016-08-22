module.exports = (function () {
    'use strict';
    var observable = require('z-observable');
    var components = {},
        mixins = {},
        toString = Object.prototype.toString,
        getType = function (obj) {
            return toString.call(obj);
        };

    /**
     * Top level class
     *
     * @class
     */
    function QObject(cfg) {
        cfg && this.apply(cfg);
        observable.prototype._init.call(this);
    }

    var prototype = {

        on: observable.prototype.on,
        fire: observable.prototype.fire,
        removableOn: observable.prototype.removableOn,
        un: observable.prototype.un,
        /**
         * Copy all properties of object2 to object1, or object1 to self if object2 not set
         *
         * @returns {*} Changed object
         * @param object1 Object
         * @param object2 Object
         */
        apply: function (object1, object2) {
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for (i in source)
                target[i] = source[i];
            return target;
        },

        /**
         * Copy all properties of one object to another
         * Does not copy existed properties
         *
         * @returns {*} Changed object
         * @param object1 Object
         * @param object2 Object
         */
        applyIfNot: function (object1, object2) {
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for (i in source)
                target[i] === void 0 && ( target[i] = source[i] );

            return target;
        },

        /**
         * Copy all properties of one object to another and make them not enumerable and not overwritable
         *
         * @param object1
         * @param object2
         * @returns {*} Changed object
         */
        applyPrivate: function (object1, object2) {
            var i,
                source = object2 || object1,
                target = object2 ? object1 : this;

            for (i in source)
                Object.defineProperty(target, i, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: source[i]
                });
            return target;
        },

        /**
         * Convert Array to hash Object
         *
         * @param arr Array: Array to convert
         * @param [val=true] Any: value that would be setted to each member
         * @returns {{hash}}
         */
        arrayToObject: function (arr, val) {
            var i = 0, _i = arr.length,
                newVal = val || true,
                out = {};
            if (arr === null || arr === void 0) return out;

            for (; i < _i; i++) {
                out[arr[i]] = newVal;
            }
            return out;
        },

        Error: function (msg, data) {
            var e = new Error(msg);
            data && QObject.apply(e, data);
            throw e;
        },
        mixin: function (name, cfg) {
            mixins[name] = cfg;
        },

        _mixing: function (cfg, mixin/* base */) {

            /*if(prototype.isArray(mixin)){
             return mixin.reduce(function(cfg, mixin){
             var name = mixin;
             if(typeof mixin === 'string')
             mixin = components[mixin] || mixins[mixin];

             if(!mixin)
             throw new Error('Unknows mixin `'+name+'`');

             return prototype._mixing(cfg, mixin);
             }, cfg);
             }*/
            if (prototype.isArray(mixin)) {
                mixin.push(cfg);
                return mixin.reduce(function (base, mixin) {
                    var name = mixin;
                    if (typeof mixin === 'string')
                        mixin = components[mixin] || mixins[mixin];

                    if (!mixin)
                        throw new Error('Unknows mixin `' + name + '`');

                    return prototype._mixing(mixin, base);
                });
            }
            var base = mixin;

            /** remove deep applied */
            var overlays = deepApply.reduce(function (storage, deepName) {
                    if (deepName in cfg) {
                        storage[deepName] = cfg[deepName];
                        delete cfg[deepName];
                    }
                    return storage;
                }, {}),
                proto, i;

            proto = prototype.apply(Object.create(base), cfg);

            for (i in overlays) {
                proto[i] = QObject.apply(Object.create(proto[i]), overlays[i]);
            }

            return proto;
        },
        /**
         * @memberOf QObject
         * @static
         */
        extend: function (name, cfg, init) {
            var mixins, constructor,

                /** what is extending */
                original = components[this._type];

            if (init)
                constructor = function (cfg) {
                    init.call(this, cfg);
                    if(this.constructor === Cmp && this._afterInit )
                        this._afterInit();
                };

            /** constructor of new component */
            var Cmp = constructor || function (cfg) {
                    original.call(this, cfg);
                    if(this.constructor === Cmp && this._afterInit )
                        this._afterInit();
                };

            /** Mixing */
            mixins = cfg.mixin;
            if(mixins) {
                delete cfg.mixin;
                mixins = prototype.makeArray(mixins);
            }else{
                mixins = [];
            }
            mixins.unshift(original.prototype);
            Cmp.prototype = prototype._mixing(cfg, mixins);
            Cmp.prototype.constructor = Cmp;

            Cmp._type = Cmp.prototype._type = name;
            Cmp.extend = QObject.extend;
            Cmp.document = QObject.document;

            /** register to components */
            components[name] = Cmp;

            return Cmp;
        },
        makeArray: function (obj) {
            return obj !== void 0 ? ( this.isArray(obj) ? obj : [obj] ) : [];
        },
        isArray: function (obj) {
            return getType(obj) === '[object Array]';
        }

    };

    // makes prototype properties not enumerable
    QObject.prototype = prototype.applyPrivate.call({}, prototype);
    prototype.apply(QObject, prototype);

    var deepApply = [/*'_setter', '_getter', */'_prop'],
        deepApplyHash = QObject.arrayToObject(deepApply);
    QObject._knownComponents = components;

    QObject._type = QObject.prototype._type = "QObject";
    QObject._knownComponents['QObject'] = QObject;
    QObject.mixins = mixins;

    if (typeof document === 'undefined') {
        //QObject.document = require("dom-lite").document;
    } else {
        QObject.document = document;
    }

    return QObject;
})();