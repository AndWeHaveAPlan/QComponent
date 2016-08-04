/**
 * Created by zibx on 01.08.16.
 */
module.exports = (function () {
    'use strict';
    /**
     * Factory of factories of properties
     */

    var dataTypes = {
        Boolean: {
            set: function () {

            },
            get: function (key, value) {
                return value;
            },
            validate: function (value) {
                if ((value !== !!value) && (value !== 'true' && value !== 'false'))
                    return false;
                else
                    return true;
            }
        },
        Variant: {
            set: function (value) {

            },
            get: function (key, value) {
                return value;
            }
        }
    };
    //class Boolean extends Type
    var setter = function (value) {
        var key = this.key,
            oldValue = this.parent._data[key],
            validate = this.validate;

        if ((!validate || (validate && validate(value))) && value !== oldValue) {
            this.parent._data[key] = value;
            if (this._set.call(this.parent, key, value, oldValue) !== false) {
                this.parent._onPropertyChanged(this.parent, key, value, oldValue);
            }else{
                this.parent._data[key] = oldValue;
            }

        } else
            return false;
    };
    var getter = function () {
        return this._get.call(this.parent, this.key, this.parent._data[this.key]);
    };

    var Property = function (type, metadata, cfg, defaultValue) {
        metadata = metadata || {};
        cfg = cfg || {};
        this.cfg = cfg;
        if('set' in metadata || 'get' in metadata)
            throw new Error('do not put get\\set to metadata');
        var dataType = dataTypes[type] || dataTypes.Variant,
            proto = {parent: null};
        proto.type = metadata.type = type;
        proto.value = metadata.defaultValue = defaultValue;

        var cls = function (parent, key, value) {
            this.parent = parent;
            this.key = key;

            if (arguments.length > 2) {
                this.set(value) !== false || this.set(this.value);
            }
        };
        cls.prototype = proto;
        proto.metadata = metadata;
        if (!('set' in cfg) && !('get' in cfg)) {
            proto._set = dataType.set;
            proto._get = dataType.get;
        } else {
            proto._set = cfg.set;
            proto._get = cfg.get;
        }
        if (('validate' in cfg) || (!('validate' in cfg) && ('validate' in dataType))) {
            proto.validate = cfg.validate || dataType.validate;
        }

        proto.set = setter;
        proto.get = getter;
        return cls;
    };

    Property.generate = {
        cssProperty: function (text) {
            return new Property('String',
                {description: text},
                {
                    set: function (key, val) {
                        if (val) {
                            this.el.style[key] = val;
                        } else {
                            this.el.style.removeProperty(key);
                        }
                    },
                    get: function (key, value) {
                        return value;
                    }
                }
            );
        },
        attributeProperty: function (text) {
            return new Property('String',
                {description: text},
                {
                    set: function (key, val) {
                        if (!val) {
                            this.el.removeAttribute(key);
                            delete this.el[key];
                        } else {
                            this.el.setAttribute(key, val);
                            this.el[key] = val;
                        }

                        this.el[key] = val;
                    },
                    get: function (key, value) {
                        return value;
                    }
                }
            );
        }
    };
    Property.defaultGetter = dataTypes.Variant.get;
    return Property;
})();