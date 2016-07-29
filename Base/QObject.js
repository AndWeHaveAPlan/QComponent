var observable = require('z-observable');

(function () {
    'use strict';

    var components = {};

    /**
     * Top level class
     *
     * @constructor
     */
    function QObject(cfg) {
        cfg && this.apply(cfg);
        observable.prototype._init.call(this);
    }

    var prototype = {

        on: observable.prototype.on,
        fire: observable.prototype.fire,

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

        extend: function (name, cfg, init) {
            var i,
                overlays, proto,

                /** what is extending */
                original = components[this._type];


            /** constructor of new component */
            var Cmp = init || function (cfg) {
                    original.call(this, cfg);
                };

            /** remove deep applied */
            overlays = deepApply.reduce(function (storage, deepName) {
                if (deepName in cfg) {
                    storage[deepName] = cfg[deepName];
                    delete cfg[deepName];
                }
                return storage;
            }, {});

            proto = Cmp.prototype = Object.create(original.prototype).apply(cfg);

            for (i in overlays) {
                proto[i] = QObject.apply(Object.create(proto[i]), overlays[i]);
            }

            Cmp._type = Cmp.prototype._type = name;
            Cmp.extend = QObject.extend;
            Cmp.document = QObject.document;

            /** register to components */
            components[name] = Cmp;

            return Cmp;
        }
    };

    // makes prototype properties not enumerable
    QObject.prototype = prototype.applyPrivate.call({}, prototype);
    prototype.apply(QObject, prototype);

    var deepApply = ['_setter', '_getter'],
        deepApplyHash = QObject.arrayToObject(deepApply);
    QObject._knownComponents = components;

    QObject.prototype._type = "QObject";
    QObject._knownComponents['QObject'] = QObject;
    if (typeof document === 'undefined') {
        //QObject.document = require("dom-lite").document;
    } else {
        QObject.document = document;
    }

    module.exports = QObject;
})();