/**
 * Created by zibx on 01.08.16.
 */
module.exports = (function () {
    'use strict';
    /**
     * Factory of factories of properties
     * setter calls on set and transform data
     * validator checks that data is correct
     * if data is correct - value is setted to data
     */

    var dataTypes = {
        Boolean: {
            set: function(value){
                return !!value;
            },
            get: function(){
                return !!this.parent._data[this.key];
            },
            validate: function (val) {
                return val === !val;
            }
        }
    };
    //class Boolean extends Type
    var setter = function (value) {
        var key = this.key;
        var val = this._set.apply(this, arguments),
            validate = this.validate;

        if(!validate || (validate && validate(val)))
            this.parent._data[key] = val;
        else
            return false;
    };
    var getter = function () {
        return this._get(this.parent._data[this.key]);
    };

    var Property = function(type, metadata, cfg, defaultValue){
        metadata = metadata || {};


        var dataType = dataTypes[type],
            proto = {parent: null};
        proto.type = metadata.type = type;
        proto.value = metadata.defaultValue = defaultValue;

        var cls = function(parent, key, value){
            this.parent = parent;
            this.key = key;

            if(arguments.length>2){
                this.set(value) !== false || this.set(this.value);
            }
        };
        cls.prototype = proto;
        proto.metadata = metadata;
        if(!('set' in cfg) && !('get' in cfg)){
            proto._set = dataType.set;
            proto._get = dataType.get;
        }else{
            proto._set = cfg.set;
            proto._get = cfg.get;
        }
        if(('validate' in cfg) || (!('validate' in cfg) && ('validate' in dataType)) ){
            proto.validate = cfg.validate || dataType.validate;
        }

        proto.set = setter;
        proto.get = getter;
        return cls;
    };

    Property.generate = {cssProperty: function (text) {
        return new Property('String', 
            {description: text},
            {
                set: function (name, val) {
                    this._data[name] = val;
                    if (val) {
                        this.el.style[name] = val;
                    } else {
                        this.el.style.removeProperty(name);
                    }
                },
                get: function (name) {
                    return this._data[name];
                }
            }
        )
    }}
    return Property;
})();