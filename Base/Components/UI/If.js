/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var QObject = require('../../QObject');


module.exports = UIComponent.extend('If', {
    _dumpChild: function (cmp) {
        var obj = {};
        obj.type = cmp._type;
        obj.data = cmp._data;
        obj.children = [];

        var iterator = cmp._children.iterator(), item;
        while (item = iterator.next()) {
            obj.children.push(this._dumpChild(item));
        }

        return obj;
    },
    _restoreChild: function (dump) {
        var ctor = QObject._knownComponents[dump.type];

        var cmp = new ctor(dump.data);

        for (var i = 0; i < dump.children.length; i++) {
            cmp._children.push(this._restoreChild(dump.children[i]));
        }

        this.mainEventManager.registerComponent(cmp);
        return cmp;
    },
    _prop: {
        value: new Property('Boolean', {}, {
            get: Property.defaultGetter,
            set: function (name, val) {
                var saved = this._data['saved'] ? this._data['saved'] : [];
                if (val) {
                    for (var i = 0; i < saved.length; i++) {
                        this._children.push(this._restoreChild(saved[i]));
                    }
                } else {
                    var iterator = this._children.iterator(), item;
                    while (item = iterator.next()) {
                        saved.push(this._dumpChild(item));
                    }
                    this._children.splice(0, this._children.length);
                    this._data['saved'] = saved;
                }
            }
        }, true)
    }
});