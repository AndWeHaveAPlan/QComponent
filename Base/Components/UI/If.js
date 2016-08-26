/**
 * Created by ravenor on 13.07.16.
 */

var Primitive = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var QObject = require('../../QObject');
var Serializer = require('../../Common/Serialization');


module.exports = UIComponent.extend('If', {
    _prop: {
        value: new Property('Boolean', {}, {
            get: Property.defaultGetter,
            set: function (name, val) {
                var self = this;
                var dump = this._data['dump'];
                if (val && dump) {
                    var restored = Serializer.restore(dump, function (cmp) {
                        self.mainEventManager.registerComponent(cmp);
                    });
                    for (var i = 0; i < restored.length; i++) {
                        self._children.push(restored[i]);
                    }
                    delete self._data['dump'];
                } else {
                    this._data['dump'] = Serializer.dump(this, true);
                    this._children.splice(0, this._children.length);
                }
            }
        }, true)
    }
});